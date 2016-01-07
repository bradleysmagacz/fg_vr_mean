/*jslint node: true */
'use strict';

var admin = require('../../app/controllers/admin.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	
	app.route('/admin').get(users.renderAdminPage);
};