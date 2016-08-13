'use strict';

var express = require('express');
var router = express.Router();
var Entry = require("../models/entry").Entry;

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('entries', {title: 'Entries', entries:entries})
//   //res.render('index', { title: 'Whisper' });
// });

router.post('/', function(req, res, next){
  var entry = new Entry(req.body);
  entry.save(function(err, post){
    if(err) return next(err);
    res.status(201);
    //res.json(post);
    res.redirect('/')
  });
});

router.get('/', function(req,res,next){
    Entry.count({}, function(err, count){
      Entry.find({}, null, function(err, entries){
        if(err) return next(err);
        if (count > 0){
          res.render('entries', {title: 'Entries', entries:entries});
        } else {
          res.send("Sorry, there aren't any posts!");
        }
      });
    });
});

router.get('/add', function(req,res,next){
  res.render('index', { title: 'Whisper' });
});

module.exports = router;
