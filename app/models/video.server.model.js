

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	cleanString = require('../helpers/cleanString');
	createdDate = require('../plugins/createdDate');

var VideoSchema = new Schema({
	title: { 
		type: String, 
		required: true,
		index: true,
		unique: true 
	},
	permalink: {
		type: String
	},
	description: { 
		type: String 
	},
	categories: { 
		type: Array,
		index: true 
	},
	actors: { 
		type: Array 
	},
	orientation: { 
		type: String 
	},
	thumb: { 
		type: String,
		default: 'img/thumbs/kitten.png' 
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

VideoSchema.pre('save', function(next) { 

	this.permalink = this.title.replace(/\s+/g, '-').toLowerCase();

	next();
});

// add created date property
VideoSchema.plugin(createdDate);

VideoSchema.on('afterRemove', function (post) {
  this.remove({ video: video._id }).exec(function (err) {
    if (err) {
      console.error('Had trouble removing the video', err.stack);
    }
  });
});

mongoose.model('Video', VideoSchema);