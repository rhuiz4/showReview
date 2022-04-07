require('./db');
require('./auth');

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

app.use('/', routes);
app.use('/shows', shows);

app.listen(process.env.PORT || 3000);