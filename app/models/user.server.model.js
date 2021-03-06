/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	createdDate = require('../plugins/createdDate'),
	crypto = require('crypto'),
	validEmail = require('../helpers/validate/email');

var UserSchema =  new Schema({
  email: { 
    	type: String, 
    	lowercase: true, 
    	trim: true, 
    	validate: validEmail, 
    	index: { unique: true }
  },
  username: { 
      type: String, 
      unique: true, 
      required: 'Username is required', 
      trim: true 
  },
	name: { 
  		first: String, 
  		last: String 
  },
	password: { 
  		type: String, 
  		required: true 
  },
	salt: { 
  		type: String 
  },
  provider: {
      type: String,
      required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
	isAdmin: { 
  		type: Boolean, 
  		default: 0 
  },
	resetPasswordToken: { 
  		type: String 
  },
	resetPasswordExpires: { 
  		type: Date 
  }
});

UserSchema.plugin(createdDate);

UserSchema.virtual('fullname').get(function () {
  return this.name.first + ' ' + this.name.last;
});

UserSchema.set('toJSON', { getters: true, virtuals: true });

UserSchema.statics.findOneByUsername = function(username, callback) {
	this.findOne({ username: new RegExp(username, 'i')}, callback);
};

UserSchema.pre('save', function(next) { 

	if(this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

  this.wasNew = this.isNew;

	next();
});

UserSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

UserSchema.post('save', function(next) {
	if (this.wasNew) {
		console.log('A new user was created');
	}
	else {
		console.log('A user updated their information');
	}
});

UserSchema.path('password').validate(function(password) {  

  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  return regex.test(password);
}, "Password must be 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number");

mongoose.model('User', UserSchema);