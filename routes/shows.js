const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Shows = mongoose.model('Show'),
    Reviews = mongoose.model('Review'),
    Users = mongoose.model('User');

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
        Reviews.find({show: show._id}, (err, reviews) => {
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
        name: req.body.name,
        year: req.body.year,
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
    Shows.find({name: req.body.name}, (err, shows, count) => {
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
        name: req.body.name,
        year: req.body.year
    }, (err, show) => {
        res.redirect('/shows/edit');
    });
});

// Deletes a show from the database
router.get('/delete/:id', (req, res) => {
    Shows.deleteOne({_id: req.params.id}, (err, show) => {
        res.redirect('/shows/edit');
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
    // Creates Review
    const review = new Reviews({
        username: req.user.username,
        show: req.params.id,
        comment: req.body.comment,
        rating: req.body.rating
    });
    review.save((err, review) => {
        // Adds review to show
        Shows.updateOne({_id: req.params.id}, {$push: {reviews: review._id}}, (err, show) => {
            // Add review to user
            Users.updateOne({_id: req.user.id}, {$push: {reviews: review._id}}, (err, user) => {
                res.redirect('/shows/details/' + req.params.id);
            });
        });
    });
});



module.exports = router;