

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	createdDate = require('../plugins/createdDate');

var VideoSchema = new Schema({
   	_id: { 
   		type: String, 
   		required: true 
   	},
	title: { 
		type: String, 
		required: true 
	},
	description: { 
		type: String 
	},
	categories: { 
		type: Array 
	},
	actors: { 
		type: Array 
	},
	age: { 
		type: String 
	},
	interracial: { 
		type: Boolean, 
		default:0 
	},
	orientation: { 
		type: String 
	},
	thumb: { 
		type: String 
	}
});

// add created date property
schema.plugin(createdDate);

// compile the model
var Video = mongoose.model('Video', schema);

// handle events
Video.on('afterInsert', function (post) {
  // fake tweet this
  var url = "http://localhost:3000/video/";
  console.log('New video has been created! %s%s', url, post.id);
})

Video.on('afterRemove', function (post) {
  this.remove({ video: video._id }).exec(function (err) {
    if (err) {
      console.error('Had trouble removing the video', err.stack);
    }
  })
})

module.exports = Video;
