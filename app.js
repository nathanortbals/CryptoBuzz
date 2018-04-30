const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('./db');
const apiCaller = require('./api-caller');

passport.use('local', new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));

passport.use('local-signup', new Strategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, cb) {
        db.users.insertUser(username, password, req.body.email, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            return cb(null, user);
        });
    }));


passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'pizza', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist/')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-datepicker/dist/')));
app.use(express.static(path.join(__dirname, 'node_modules/chart.js/dist/')));

// Define routes.
app.get('/',
    function(req, res) {
        res.render('index', { user: req.user });
    });

app.get('/login',
    function(req, res){
        res.render('login');
    });

app.get('/register',
    function(req, res){
        res.render('register');
    });

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.post('/register',
    passport.authenticate('local-signup', {failureRedirect: '/register'}),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout',
    function(req, res){
        req.logout();
        res.redirect('/');
    });

/* GET data */
app.get('/get_data', function(req, res) {
    if(!req.query.startDate || !req.query.endDate || !req.query.currencyId) {
        res.sendStatus(500);
    } else {
        apiCaller.GetJsonData(req.query.currencyId, req.query.startDate, req.query.endDate)
            .then(function(response) {
                console.log('res  ' + response);
                res.send(response)
            })
            .catch(function(err){
                console.log('err ' + err);
                res.send(err)
            });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
