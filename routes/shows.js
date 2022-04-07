const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Shows = mongoose.model('Show');

router.get('/', (req, res) => {
    Shows.find({}, (err, shows, count) => {
        res.render('shows-all', {shows:shows});
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

// Allows users to add a show
// For now you can only change year and add reviews
router.get('/edit', (req, res) => {
    res.render('shows-edit');
});

router.post('/edit', (req, res) => {
    Shows.updateOne({name: req.body.name}, {$set: {year: req.body.year}}, (err, show) => {
        if (req.body.reviews !== '') {
            Shows.updateOne({name: req.body.name}, {$push: {reviews: req.body.review}}, (err, show) => {
                res.redirect('/shows');
            });
        } else {
            res.redirect('/shows');
        }
    });
});

// Deletes a show from the database
router.get('/delete/:id', (req, res) => {
    Shows.deleteOne({_id: req.params.id}, (err, show) => {
        res.redirect('/shows');
    });
});

// TO-DO: Implement adding shows to user lists
router.get('/add-show', (req, res) => {
    res.render('shows-add');
});

module.exports = router;