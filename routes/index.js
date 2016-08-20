'use strict';

var express = require('express');
var router = express.Router();
var Entry = require("../models/entry").Entry;
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
          res.render('index', {title: 'Entries', 'entries':entries});
        } else {
          res.send("Sorry, there aren't any posts!");
        }
      });
    });
});

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
