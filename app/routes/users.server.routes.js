/*jslint node: true */
'use strict';

var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	
	app.route('/signup')
		.get(users.renderSignupPage)
		.post(users.createUser, users.sendConfirmationEmail);

	app.route('/login')
		.get(users.renderLoginPage)
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.route('/logout')
		.get(users.logout);

	app.route('/forgot')
		.get(users.renderForgotPasswordPage)
		.post(users.sendResetPasswordEmail);

	app.route('/reset/:token')
		.get(users.renderResetPasswordPage)
		.post(users.resetPassword);

	app.param('token', users.retrievePasswordToken);
};