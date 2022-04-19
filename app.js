require('./db');
require('./auth');

const passport = require('passport');
const express = require('express');
const path = require('path');

const routes = require('./routes/index');
const shows = require('./routes/shows');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: process.env.SECRETCOOKIE,
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// make user data available to all templates
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use('/', routes);
app.use('/shows', shows);

app.listen(process.env.PORT || 3000);
console.log('Server started');