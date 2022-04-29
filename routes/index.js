const express = require('express'), 
      router = express.Router(),
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      passport = require('passport');
      sanitize = require('mongo-sanitize'); // Prevents injection

router.get('/', (req, res) => {
  res.redirect('/shows');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const username = sanitize(req.body.username);
  User.register(new User({username}), sanitize(req.body.password), (err, user) => {
    if (err) {
      const errStr = err.toString();
      const colInd = errStr.indexOf(':');
      if (colInd > -1) {
        const errMsg = errStr.slice(colInd + 2);
        res.render('register', {message: errMsg});
      } else {
          res.render('register',{message:"Registration failed"});
      }
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
        console.log(err);
        res.redirect('/');
      });
    } else {
      console.log(err);
      res.render('login', {message:'Your username or password is incorrect.'});
    }
  })(req, res, next);
});

module.exports = router;
