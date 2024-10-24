var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Home page
router.get('/', function (req, res) {
    res.render('index', { user: req.user });
});

// Register routes
router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ 
        username: req.body.username,
        email: req.body.email 
    }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { error: err.message });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/dashboard');
        });
    });
});

// Login routes
router.get('/login', function(req, res) {
    res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local', { 
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

// Google Auth routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);

// Logout route
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Dashboard route
router.get('/dashboard', isAuthenticated, function(req, res) {
    res.render('dashboard', { 
        user: req.user,
        title: 'Dashboard'
    });
});

// Resources route
router.get('/resources', isAuthenticated, function(req, res) {
    // You can add your resources data here
    const resources = [
        {
            title: "Mathematics behind Deep Learning Lesson 1",
            link: "https://docs.google.com/document/d/yourlink1",
            type: "pdf"
        },
        {
            title: "Java Lesson 3",
            link: "https://docs.google.com/document/d/yourlink2",
            type: "doc"
        },
        {
            title: "How to use the ChatGPT API",
            link: "https://docs.google.com/document/d/yourlink3",
            type: "doc"
        }
    ];

    res.render('resources', { 
        user: req.user,
        title: 'Resources',
        resources: resources
    });
});

// Ping route (for testing)
router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;