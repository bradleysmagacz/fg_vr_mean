/*jslint node: true */
'use strict';

var users = require('../../app/controllers/users.server.controller');
var videos = require('../../app/controllers/videos.server.controller');

module.exports = function(app) {
	
	app.route('/api/videos')
		.get(videos.list)
		.post(users.authenticateUser, videos.create);

	app.route('/api/videos/:videoId')
		.get(videos.read)
		.put(users.authenticateUser, videos.update)
		.delete(users.authenticateUser, videos.delete);

	app.param('videoId', videos.videoByID);
};