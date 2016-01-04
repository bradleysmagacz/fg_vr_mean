
var users = require('../../app/controllers/users.server.controller');
var articles = require('../../app/controllers/articles.server.controller');

module.exports = function(app) {
	
	app.route('/api/articles')
		.get(articles.list)
		.post(users.authenticateUser, articles.create);

	app.route('/api/articles/:articleId')
		.get(articles.read)
		.put(users.authenticateUser, articles.hasAuthorization, articles.update)
		.delete(users.authenticateUser, articles.hasAuthorization, articles.delete);

	app.param('articleId', articles.articleByID);
}