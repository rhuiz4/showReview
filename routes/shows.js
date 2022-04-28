const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Shows = mongoose.model('Show'),
    Reviews = mongoose.model('Review'),
    Users = mongoose.model('User');
    sanitize = require('mongo-sanitize');

const isAuthenticated = (req, res, next) => {
    if(!req.user) {
        res.redirect('/'); 
        console.log('redirecting');
    } else {
        next();
    }
};
    
router.use(isAuthenticated);

router.get('/', (req, res) => {
    
    // Finds current user
    Users.findOne({_id: req.user.id}, (err, user) => {

        // Find all shows that the user has in their shows array
        Shows.find({_id: {$in: user.shows}}, (err, shows) => {
            res.render('shows-all', {shows: shows});
        });
    });
});

// Shows show details
router.get('/details/:id', (req, res) => {
    // Find show given id
    Shows.findOne({_id: req.params.id}, (err, show) => {
        // Find all reviews for show
        Reviews.find({_id: {$in: show.reviews}}, (err, reviews) => {
            res.render('shows-details', {show: show, reviews: reviews});
        });
    });
});

// Creating a new show to the database
// Normal users will not be able to create a show
router.get('/create', (req, res) => {
    res.render('shows-create');
});

router.post('/create', (req, res) => {
    const show = new Shows({
        name: sanitize(req.body.name),
        year: sanitize(req.body.year),
        reviews: []
    });
    show.save((err, show) => {
        res.redirect('/shows');
    });
});

// Allows users to search for shows
// Users can add shows to their list
router.get('/search', (req, res) => {
    Shows.find({}, (err, shows, count) => {
        res.render('shows-search', {shows:shows, option:"All Shows:"});
    });
});

router.post('/search', (req, res) => {
    Shows.find({name: sanitize(req.body.name)}, (err, shows, count) => {
        res.render('shows-search', {shows:shows, option:"Results:"});
    });
});


// Displays page to edit shows
router.get('/edit', (req, res) => {
    // Shows all shows
    Shows.find({}, (err, shows, count) => {
        res.render('shows-edit', {shows:shows});
    });
});

// Shows details for a show and allows users to edit the show
router.get('/edit-show/:id', (req, res) => {
    Shows.findOne({_id: req.params.id}, (err, show) => {
        Reviews.find({show: show._id}, (err, reviews) => {
            res.render('shows-edit-show', {show: show, reviews: reviews});
        });
    });
});

// Updates the show with the new information
router.post('/edit-show/:id', (req, res) => {
    // Updates show with new information
    Shows.findOneAndUpdate({_id: req.params.id}, {
        name: sanitize(req.body.name),
        year: sanitize(req.body.year)
    }, (err, show) => {
        res.redirect('/shows/edit');
    });
});

// Deletes a show from the database
router.get('/delete/:id', (req, res) => {
    // Removes show from all users
    Users.updateOne({}, {$pull: {shows: req.params.id}}, (err, user) => {
        Shows.deleteOne({_id: req.params.id}, (err, show) => {
            res.redirect('/shows/edit');
        });
    });
});

// Removes a show from a user's show list
router.get('/remove/:id', (req, res) => {
    Users.updateOne({_id: req.user.id}, {$pull: {shows: req.params.id}}, (err, user) => {
        res.redirect('/shows');
    });
});

// Adds show to the user's show list
router.get('/add-show/:id', (req, res) => {
    Users.updateOne({_id: req.user.id}, {$push: {shows: req.params.id}}, (err, user) => {
        res.redirect('/shows');
    });
});

// Adds a review to a show
router.post('/add-review/:id', (req, res) => {
    // Finds show name
    Shows.findOne({_id: req.params.id}, (err, show) => {
        // Creates Review
        const review = new Reviews({
            username: req.user.username,
            show: show.name,
            comment: sanitize(req.body.comment),
            rating: sanitize(req.body.rating)
        });
        review.save((err, review) => {
            // Adds review to show
            show.reviews.push(review);
            show.save((err, show) => {
                // Add review to user
                Users.updateOne({_id: req.user.id}, {$push: {reviews: review._id}}, (err, user) => {
                    res.redirect('/shows/details/' + req.params.id);
                });
            });
        });
    });
});

// Retrieves all reviews from a user
router.get('/reviews', (req, res) => {
    Users.findOne({_id: req.user.id}, (err, user) => {
        console.log(user);
        Reviews.find({_id: {$in: user.reviews}}, (err, reviews) => {
            res.render('shows-reviews', {reviews: reviews});
        });
    });
});

// Deletes a review
router.get('/delete-review/:id', (req, res) => {
    // Removes review from user
    Users.updateOne({_id: req.user.id}, {$pull: {reviews: req.params.id}}, (err, user) => {
        // Removes review from show
        Shows.updateOne({_id: req.params.id}, {$pull: {reviews: req.params.id}}, (err, show) => {
            // Removes review from database
            Reviews.deleteOne({_id: req.params.id}, (err, review) => {
                res.redirect('/shows/reviews');
            });
        });
    });
});


module.exports = router;