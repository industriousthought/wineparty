var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var user = require('../models/users.js');
/* GET users listing. */

router.post('/', function(req, res, next) {
    res.redirect('https://www.industriousthought.com/auth/facebook/');
/*
    if (req.user && req.user.id) {
        res.render('user', {user: req.user});
    } else {
        res.render('login', {});
    }
*/
});



module.exports = router;
