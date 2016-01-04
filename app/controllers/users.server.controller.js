var User = require('mongoose').model('User');
var nodemailer = require('nodemailer');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');
var passport = require('passport');

var getErrorMessage = function(err) {

    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Email address already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }

    return message;
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

exports.OLD_createUser = function(req, res, next) {

    var email = cleanString(req.body.email);
    var pass = cleanString(req.body.password);
    var c_pass = cleanString(req.body.confirm_password);

    if (!(email && pass)) {
        return invalid();
    }

    if (pass != c_pass) {
        return unmatched();
    }

    if (!req.user) {

        var user = new User(req.body);
        var message = null;

        user.provider = 'local';

        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);

                return res.render('signup', {
                    error: true,
                    message: message
                });
            }

            if (user.isAdmin) {
                req.session.isAdmin = true;
            }

            req.login(user, function(err) { 
                if (err) {
                    return next(err);
                } else {
                    req.session.isLoggedIn = true;
                    req.session.email = user.email;
                    req.userFirstName = user.name.first;
                    req.user = user;
                    next();
                }
            });
        }); 
    } 

    else {
            return res.redirect('/');
    }

    function invalid() {
        return res.render('signup.jade', {
            invalid: true
        });
    }

    function unmatched() {
        return res.render('signup.jade', {
            unmatched: true
        });
    }

};

exports.sendConfirmationEmail = function(req, res, next) {

    var email = req.user.email;
    var firstName = req.user.name.first;

    var transporter = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
            user: 'bradleysmagacz@yahoo.com',
            pass: 'megaman1'
        }
    });

    var mailOptions = {
        from: 'Foggy Goggles <bradleysmagacz@yahoo.com>', // sender address 
        to: email, // list of receivers 
        subject: 'Welcome to Foggy Goggles!', // Subject line 
        text: 'Hi, ' + firstName, // plaintext body 
        html: '<strong>Hello, ' + firstName + '</strong>' // html body 
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            return console.log(err);
        }

        console.log('Message sent: ' + info.response);

    });

    return res.redirect('/');
};

exports.userLogin = function(req, res, next) {
    var email = cleanString(req.body.email);
    var pass = cleanString(req.body.password);

    if (!(email && pass)) {
        return invalid();
    }

    // user friendly
    email = email.toLowerCase();

    var query = { email: email };

    // query mongodb
    User.findOne(query, function(err, user) {

        if (err) return next(err);

        //check to see if user exists and password is correct
        if (!user || !(user.authenticate(pass))) {
            return invalid();
        }

        if (user.isAdmin) {
            req.session.isAdmin = true;
        }

        req.session.isLoggedIn = true;
        req.user = user;
        req.session.email = email;
        req.session.name = user.name.first;
        res.redirect('/');
    })

    function invalid() {
        return res.render('login', {
            invalid: true
        });
    }
}

exports.list = function(req, res, next) {

    User.find({}, function(err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.user);
}

exports.userByID = function(req, res, next, id) {
    User.findOne({
        _id: id
    }, function(err, user) {
        if (err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

exports.update = function(req, res, next) {

    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
}

exports.delete = function(req, res, next) {

    req.user.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.user)
        }
    });
};

exports.authenticateUser = function(req, res, next) {
	if (!req.user) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

exports.renderSignupPage = function(req, res) {

    if (!req.user) {
        res.render('signup', { 
            title: 'Create Account', 
            messages: req.flash('error') 
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderLoginPage = function(req, res) {

    if (!req.user) {
        res.render('login', { 
            title: 'Login', 
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        res.redirect('/');
    }
};

exports.createUser = function(req, res, next) {
    if (!req.user) {
        
        var user = new User(req.body);
        var message = null;
        
        user.provider = 'local';
        
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            
            req.login(user, function(err) {
                if (err) return next(err);
                req.user = user;
                next();
            });
        });
    } else {
        return res.redirect('/');
    }
};

exports.OLD_logout = function(req, res) {
    req.logout();
    req.session.isAdmin = false;
    req.session.isLoggedIn = false;
    req.user = null;
    req.session.email = null;
    req.session.name = null;
    res.redirect('/');
}

exports.logout = function(req, res) { 
    req.logout(); 
    res.redirect('/'); 
};