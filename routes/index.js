'use strict';

var express = require('express');
var router = express.Router();
var Entry = require("../models/entry").Entry;
var User = require('../models/user');
var middleware = require('../middleware');
var ObjectId = require('mongodb').ObjectID;

//GET /
router.get('/', function(req,res,next){
    Entry.count({}, function(err, count){
      Entry.find({}, null, function(err, entries){
        if(err) return next(err);
      })
      .sort('date').exec(function(err, entries){
        if (count > 0){
          console.log(entries)
          res.render('index', {title: 'Whisper', 'entries':entries});
        } else {
          res.render('no-posts', {title: 'No Posts Found', 'entries':entries});
        }
      });
    });
});

router.get('/login', middleware.loggedOut, function(req, res, next){
  return res.render('login');
});

router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/special');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

router.get('/register', middleware.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      };

      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/special');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});

router.get('/special', middleware.requiresLogin, function(req, res, next){
  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        return next(error);
      } else {
        return res.render('special');
      }
    })
});

router.get('/logout', function(req,res,next){
  if (req.session){
    req.session.destroy(function(err){
      if(err){
        return next(err);
      } else {
        return res.redirect('/')
      }
    })
  }
})

// get /oldest-newest
router.get('/oldest-newest', function(req,res,next){
    Entry.count({}, function(err, count){
      Entry.find({}, null, function(err, entries){
        if(err) return next(err);
      })
      .sort('date').exec(function(err, entries){
        if (count > 0){
          res.render('index', {title: 'Entries', 'entries':entries});
        } else {
          res.send("Sorry, there aren't any posts!");
        }
      });
    });
});

//GET entry/:id
router.get('/entry/:id', function(req, res, next){
  Entry.findOne({_id: ObjectId(req.params.id)}, function(err, entry){
    if(err) return next(err);
    console.log(entry.entryTitle)
    res.render('entry', {title: req.params.entryTitle, 'entry':entry});
  });
});

//DELETE entry/:id
router.post('/entry/:id/delete', function(req, res, next){
  Entry.findByIdAndRemove(req.params.id, function(err, entry){
    if(err) return next(err);
    res.redirect('/');
  });
});

router.get('/entry/:id/edit', function(req, res, next){
  Entry.findOne({_id: ObjectId(req.params.id)}, function(err, entry){
    if(err) return next(err);
      res.render('update-entry', {title: req.params.entryTitle, 'entry':entry});
  });
});

router.post('/entry/:id/edit', function(req, res, next){
  Entry.findOne({_id: ObjectId(req.params.id)}, function(err, entry){
    if(err) return next(err);
    entry.author = req.body.author;
    entry.entryTitle = req.body.entryTitle;
    entry.entryBody = req.body.entryBody;
    entry.save();
    res.status(201);
    res.redirect('/')
  });
});

//POST /add
router.post('/add', function(req, res, next){
  var entry = new Entry(req.body);
  entry.save(function(err, post){
    if(err) return next(err);
    res.status(201);
    //res.json(post);
    res.redirect('/')
  });
});

//GET /add
router.get('/add', function(req,res,next){
  res.render('add-entry', { title: 'Add an Entry' });
});

module.exports = router;
