const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Shows = mongoose.model('Show'),
    Reviews = mongoose.model('Review'),
    Users = mongoose.model('User');
    sanitize = require('mongo-sanitize');

const isAuthenticated = (req, res, next) => {
    if(!req.user) {
        res.redirect('/login'); 
    } else {
        next();
    }
};
    
router.use(isAuthenticated);

router.get('/', (req, res) => {
    
    // Finds current user
    Users.findOne({_id: req.user.id}, (err, user) => {
        remove_deleted_reviews(user);
        remove_deleted_shows(user);
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
            // Find the average rating for the show
            average = reviews.reduce((acc, review) => {
                return acc + review.rating;
            }, 0) / reviews.length;

            // let total = 0;
            // for (let i = 0; i < reviews.length; i++) {
            //     total += reviews[i].rating;
            // }
            // let average = total / reviews.length;
            // average = average.toFixed(2);
            res.render('shows-details', {show: show, reviews: reviews, average: average});
        });
    });
});

// Creating a new show to the database
// Normal users will not be able to create a show
router.get('/create', (req, res) => {
    res.render('shows-create');
});

router.post('/create', (req, res) => {
    let showName = sanitize(req.body.name);
    let showYear = sanitize(req.body.year);
    if (isNaN(showYear)) {
        res.render('shows-create', {error: 'Year must be a number.'});
    } else if (showName === '' || showYear === '') {
        res.render('shows-create', {error: 'Name and Year cannot be empty.'});
    } else {
        showYear = parseInt(showYear);
        if (showYear < 1000 || showYear > 2022) {
            res.render('shows-create', {error: 'Year must be between 1000 and 2022.'});
        } else{
            Shows.findOne({name: showName, year: showYear}, (err, show) => {
                if (show) {
                    res.render('shows-create', {error: 'Show already exists.'});
                } else {
                    const show = new Shows({
                        name: showName,
                        year: showYear,
                        reviews: []
                    });
                    show.save((err, show) => {
                        res.redirect('/shows');
                    });
                }
            });
        }
    }
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
        Reviews.find({_id: {$in: show.reviews}}, (err, reviews) => {
            res.render('shows-edit-show', {show: show, reviews: reviews});
        });
    });
});

// Updates the show with the new information
router.post('/edit-show/:id', (req, res) => {
    let showName = sanitize(req.body.name);
    let showYear = sanitize(req.body.year);
    if (isNaN(showYear)) {
        res.redirect('/shows/edit-show/' + req.params.id);
    } else if (showName === '' || showYear === '') {
        res.redirect('/shows/edit-show/' + req.params.id);
    } else {
        showYear = parseInt(showYear);
        if (showYear < 1000 || showYear > 2022) {
            res.redirect('/shows/edit-show/' + req.params.id);
        } else{
            Shows.findOne({name: showName, year: showYear}, (err, show) => {
                if (show) {
                    res.redirect('/shows/edit-show/' + req.params.id);
                } else {
                    // Updates show with new information
                    Shows.findOneAndUpdate({_id: req.params.id}, {
                        name: showName,
                        year: showYear
                    }, (err, show) => {
                        // Removes deleted reviews from show
                        remove_deleted_reviews(show);
                        res.redirect('/shows/edit');
                    });
                }
            });
        }
    }
});

// Deletes a show from the database
router.get('/delete/:id', (req, res) => {
    Shows.findOne({_id: req.params.id}, (err, show) => {
        // Deletes all reviews for show
        Reviews.deleteMany({_id: {$in: show.reviews}}, (err, reviews) => {
            Shows.deleteOne({_id: req.params.id}, (err, show) => {
                res.redirect('/shows/edit');
            });
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
                Users.updateOne({_id: req.user.id}, {$push: {reviews: review}}, (err, user) => {
                    res.redirect('/shows/details/' + req.params.id);
                });
            });
        });
    });
});

// Retrieves all reviews from a user
router.get('/reviews', (req, res) => {
    Users.findOne({_id: req.user.id}, (err, user) => {
        Reviews.find({_id: {$in: user.reviews}}, (err, reviews) => {
            res.render('shows-reviews', {reviews: reviews});
        });
    });
});

// Deletes a user review
router.get('/delete-review/:id', (req, res) => {
    Reviews.deleteOne({_id: req.params.id}, (err, review) => {
        res.redirect('/shows/reviews');
    });
});

// Deletes review from show
router.get('/delete-show-review/:id', (req, res) => {
    Reviews.findOne({_id: req.params.id}, (err, review) => {
        // Finds show given review
        Shows.find({name: review.show}, (err, shows) => {
            let ind = 0;
            if (shows.length > 1) { // Multiple shows with same name
                // Find which show the review is in
                const allReviews = shows.map(show => show.reviews);
                // Loops through reviews of each show
                allReviews.forEach(reviews => {
                    // Loops through each review
                    for (let i = 0; i < reviews.length; i++) {
                        // Checks if review is the same as the one being deleted
                        if (reviews[i]._id.toString() == review._id.toString()) {
                            ind = i;
                        }
                    }
                });
            }
            const currShow = shows[ind];
            Reviews.deleteOne({_id: req.params.id}, (err, review) => {
                res.redirect('/shows/edit-show/' + currShow._id);
            });
        });
    });

});

// Removes deleted reviews from show or user
function remove_deleted_reviews(collection) {
    Reviews.find({}, (err, allReviews) => {
        const allReviewsIds = allReviews.map(review => review._id);
        const newReviews = collection.reviews.filter(review => {
            for (let i = 0; i < allReviewsIds.length; i++) {
                if (review.toString() == allReviewsIds[i].toString()) {
                    return true;
                }
            }
            return false;
        });
        collection.reviews = newReviews;
        collection.save((err, show) => {});
    });
}

// Removes deleted shows from user
function remove_deleted_shows(user) {
    Shows.find({}, (err, allShows) => {
        const allShowsIds = allShows.map(show => show._id);
        const newShows = user.shows.filter(show => {
            for (let i = 0; i < allShowsIds.length; i++) {
                if (show.toString() == allShowsIds[i].toString()) {
                    return true;
                }
            }
            return false;
        });
        user.shows = newShows;
        user.save((err, user) => {});
    });
}

module.exports = router;