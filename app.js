var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');

mongoose.connect("mongodb://localhost:27017/whisper");

var db = mongoose.connection;

db.on("error", function(err){
	console.err("Connection Error: ", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

app.use(session({
	secret: "my socks are red",
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

app.use(function(req, res, next){
	res.locals.currentUser = req.session.userId;
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var routes = require('./routes/index');
var users = require('./routes/users');
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// TODO: Find optimal way to organize routes
// TODO: Organize views folder
// TODO: Make landing page
// TODO: Entries only viewable by logged in user
// TODO: Show logged in status on every page
// TODO: Entries are attached to a user
// TODO: User can only edit own entries
// TODO: User can view only their entries
// TODO: View entries by user
// TODO: Find word processing plugin
// TODO: User profile page


module.exports = app;
