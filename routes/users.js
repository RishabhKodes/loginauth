var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator());

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Users Home page');
});

router.get('/register', function(req, res, next) {
  res.send("This is GET register page, (send a POST request for registering user.)");
});

router.get('/login', function(req, res, next) {
  res.send("This is the GET login page");
});

router.post('/login', function(req, res){

  var email = req.body.email;
  var password = req.body.password;

  User.getUserByEmail(email, function(err, user){
    if(err) throw err;
    if(!user){
      res.send('Unknown User');
    }else{
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch){
          console.log('You are now logged in Succesfully!');
          res.redirect('/');
        } else {
          res.send('Invalid Password');
        }
      });
    }
  });
});

router.post('/register' ,function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;


  // Form Validator
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  // Check Errors
  var errors = req.validationErrors();

  if(errors){
  	res.send({"error":errors});
  } else{
  	var newUser = new User({
      name: name,
      email: email,
      password: password,
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    res.send('You are now registered and can login');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
