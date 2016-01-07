/*jslint node: true */
'use strict';

var User = require('mongoose').model('User');

exports.renderAdminPage = function() {
	if (req.user) {
        res.render('admin', { 
            title: 'Admin Area'
        });
    } else {
        return res.redirect('/');
    }
}