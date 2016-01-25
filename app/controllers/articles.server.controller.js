/*jslint node: true */
'use strict';

var Article = require('mongoose').model('Article');

var getErrorMessage = function(err) {

	var message = '';

	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				message = err.errors[errName].message;
				return message;
			}
		}
	}

	else {
		return 'Unknown server error';
	}
};

exports.create = function(req, res) {

	var article = new Article(req.body);
	
	article.creator = req.user;

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}

		else {
			res.json(article);
		}
	});
};

exports.list = function(req, res, next) {
	Article.find().sort('-created').populate('creator', 'name').exec(function(err, articles){ 
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}

		else {
			res.json(articles);
		}
	});
};

exports.articleByID = function(req, res, next, id) {
	
	Article.findById(id).populate('creator', 'name').exec(function(err, article) { 
		if (err) {
			return next(err);
		}

		if (!article) {
			return next(new Error('Failed to load article ' + id));
		}

		req.article = article;
		next();
	});
};

exports.read = function(req, res) {
	res.json(req.article);
};

exports.update = function(req, res, next) {

	var article = req.article;

	article.title = req.body.title;
	article.content = req.body.content;

 	article.save(function(err) { 
 		if (err) {
 			return res.status(400).send({
 				message: getErrorMessage(err)
 			});
 		} else {
 			res.json(article);
 		}
 	});
};

exports.delete = function(req, res) { 
	
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.article.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};