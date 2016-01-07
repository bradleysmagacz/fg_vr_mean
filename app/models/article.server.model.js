/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
	createdDate = require('../plugins/createdDate'),
	Schema = mongoose.Schema;

var ArticleSchema = new Schema({ 
	title: { 
		type: String, 
		default:'', 
		trim: true, 
		required:'Title cannot be blank'
	},
	content: {
		type: String,
		default:'',
		trim: true
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

ArticleSchema.plugin(createdDate);

mongoose.model('Article', ArticleSchema);