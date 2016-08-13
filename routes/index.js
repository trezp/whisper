'use strict';

var express = require('express');
var router = express.Router();
var Entry = require("../models/entry").Entry;
var ObjectId = require('mongodb').ObjectID;

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('entries', {title: 'Entries', entries:entries})
//   //res.render('index', { title: 'Whisper' });
// });

// router.param('id', function(req,res,next,id){
//   var id = req.params.id;
//   next();
// });

//GET /
router.get('/', function(req,res,next){
    Entry.count({}, function(err, count){
      Entry.find({}, null, function(err, entries){
        if(err) return next(err);
        if (count > 0){
          res.render('index', {title: 'Entries', entries:entries});
        } else {
          res.send("Sorry, there aren't any posts!");
        }
      });
    });
});

//DELETE /
router.get('/entry/:id', function(req, res, next){
  var id = req.params.id;
  Entry.findOne({_id: ObjectId(id)}, function(err, entry){
    if(err) return next(err);
    console.log(entry.entryTitle);
    res.render('entry', {title: req.params.entryTitle, entry:entry});
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
