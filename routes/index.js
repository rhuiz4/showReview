const express = require('express'), 
      router = express.Router();
      mongoose = require('mongoose'),
      User = mongoose.model('User');
      passport = require('passport');

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/login', (req, res) =>  {
  res.render('login');
});

router.get('/register', (req, res) =>  {
  res.render('register');
});

router.post('/register', (req, res) =>  {
  const username = req.body.username;
  User.register(new User({username}), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if(user) {
      req.logIn(user, (err) => {
        res.redirect('/');
      });
    } else {
      console.log(err);
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

module.exports = router;
