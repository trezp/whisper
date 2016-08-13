'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var moment = require('moment');

var EntrySchema = new Schema({
  author: String,
  entryTitle: String,
  entryBody: String,
  date: {type: String, default: moment().format("dddd, MMMM Do YYYY, h:mm a")},
  rawDate: {type: Date, default: Date.now}
});

EntrySchema.method("edit", function(edits, callback){
  Object.assign(this, edits, {date: moment().format("dddd, MMMM Do YYYY, h:mm a")});
  this.parent().save(callback);
})

var Entry = mongoose.model("Entry", EntrySchema);

module.exports.Entry = Entry;
