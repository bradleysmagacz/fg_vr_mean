/*jslint node: true */
'use strict';

var Video = require('mongoose').model('Video');

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

	var video = new Video(req.body);
	
	video.creator = req.user;

	video.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}

		else {
			res.json(video);
		}
	});
};

exports.list = function(req, res, next) {
	Video.find().sort('-created').populate('creator', 'name').exec(function(err, videos){ 
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}

		else {
			res.json(videos);
		}
	});
};

exports.videoByID = function(req, res, next, id) {
	
	Video.findById(id).populate('creator', 'name').exec(function(err, video) { 
		if (err) {
			return next(err);
		}

		if (!video) {
			return next(new Error('Failed to load video ' + id));
		}

		req.video = video;
		next();
	});
};

exports.read = function(req, res) {
	res.json(req.video);
};

exports.update = function(req, res, next) {

	var video = req.video;

	video.title = req.body.title;
	video.content = req.body.content;

 	video.save(function(err) { 
 		if (err) {
 			return res.status(400).send({
 				message: getErrorMessage(err)
 			});
 		} else {
 			res.json(video);
 		}
 	});
};

exports.delete = function(req, res) { 
	
	var video = req.video;

	video.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(video);
		}
	});
};