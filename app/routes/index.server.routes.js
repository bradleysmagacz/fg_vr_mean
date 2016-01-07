/*jslint node: true */
'use strict';

module.exports = function(app) {

	var index = require('../controllers/index.server.controller');

	app.get('/', index.render);
};