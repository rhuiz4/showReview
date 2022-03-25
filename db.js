const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
  passportLocalMongoose = require('passport-local-mongoose');


const User = new mongoose.Schema({
	// username, password
	shows:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }],
	notes: [Note],
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Note = new mongoose.Schema({
	show: {type: String, required: true},
	watched: {type: Boolean, default: false, required: true},
	comment: {type:String, required: false}
});

const Show = new mongoose.Schema({
  	name: {type: String, required: true},
	year: {type: Number, required: true},
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Review = new mongoose.Schema({
	user: {type: String, required: true},
	show: {type: String, required: true},
	created: {type: Date, required: true},
	rating: {type: Number, required: true},
	comment: {type: String, required: false}
});


User.plugin(passportLocalMongoose);
List.plugin(URLSlugs('name'));

mongoose.model('User', User);
mongoose.model('Note', Note);
mongoose.model('Show', Show);
mongoose.model('Review', Review);
mongoose.connect('mongodb://localhost/showdb');
