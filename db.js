const mongoose = require('mongoose');
	  passportLocalMongoose = require('passport-local-mongoose');

const User = new mongoose.Schema({
	// username: {type: String, required: true},
	// password: {type: String, required: true},
	shows:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }],
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Show = new mongoose.Schema({
  	name: {type: String, required: true},
	year: {type: Number, required: true},
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Review = new mongoose.Schema({
	username: {type: String, required: true},
	show: {type: String, required: true},
	rating: {type: Number, required: true},
	comment: {type: String, required: false}
});


User.plugin(passportLocalMongoose);

mongoose.model('User', User);
mongoose.model('Show', Show);
mongoose.model('Review', Review);
mongoose.connect(process.env.MONGODB_URI);