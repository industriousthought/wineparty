var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/wineparty';
mongoose.connect(url);

mongoose.connection.on('connected', function () {  
      console.log('Mongoose default connection open to ' + url);
}); 
var fs = require('fs');
var https = require('https');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./oauth');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookCanvasStrategy = require('passport-facebook-canvas');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var session = require('express-session');
var uuid = require('node-uuid').v1;
var mongoose = require('mongoose');

//var wines = require('./routes/wines');
var index = require('./routes/index');
var parties = require('./routes/parties');
var canvasApp = require('./routes/canvasApp');

var app = express();

https.createServer({
    key: fs.readFileSync('/etc/ssl/localcerts/www.industriousthought.com.key'),
    cert: fs.readFileSync('/etc/ssl/localcerts/www.industriousthought.com.crt')
}, app).listen(443);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    genid: function(req) {
        return uuid() // use UUIDs for session IDs 
    },
    secret: 'keyboard cat'
}))

app.use(passport.initialize());
app.use(passport.session());


//app.use('/wines', wines);
app.use('/', index);
app.use('/canvasApp', canvasApp);
app.use('/parties', parties);


passport.use(new FacebookCanvasStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: 'https://www.industriousthought.com/auth/facebook-canvas/callback'
},
function(accessToken, refreshToken, profile, done) {

    profile.accessToken = accessToken;
    process.nextTick(function() {
        done(null, profile);
    });
}
));

passport.use(new FacebookStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: 'https://www.industriousthought.com/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {

    profile.accessToken = accessToken;
    process.nextTick(function() {
        done(null, profile);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'user_friends' }));
app.get('/auth/facebook-canvas', passport.authenticate('facebook-canvas', { scope: 'user_friends' }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/success',
    failureRedirect: '/error'
}));

app.get('/auth/facebook-canvas/callback', passport.authenticate('facebook-canvas', {
    successRedirect: '/success',
    failureRedirect: '/auth/facebook-canvas/autologin'
}));

app.get('/auth/facebook-canvas/autologin', function( req, res ){
    console.log('autologgggin');
    res.send( '<!DOCTYPE html>' +
        '<html>' +
        '<body>' +
        '<script type="text/javascript">' +
        'console.log("replaceing top");' +
        'top.location.replace("/auth/facebook");' +
        '</script>' +
        '</body>' +
        '</html>' );
});

app.get('/success', function(req, res, next) {
    if (req.user) { 
        if (req.session && req.session.canvasUser) {
            console.log('canvasuser');
            res.redirect('https://apps.facebook.com/industriousthought');
        } else {
            res.redirect('/');
        }
    } else {
        res.render('login', {login: 'fail'});
    }
});

app.get('/error', function(req, res, next) {
    res.render('login', {login: 'fail'});
});

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



module.exports = app;
