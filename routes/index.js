var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var user = require('../models/users.js');
/* GET users listing. */

router.get('/', function(req, res, next) {
    if (req.user && req.user.id) {
        res.render('user', {user: req.user});
    } else {
        res.render('login', {});
    }

});



module.exports = router;
