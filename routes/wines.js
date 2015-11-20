var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var wines = require('../models/wines.js');

router.get('/', function(req, res, next) {
    /*
    wines.find({ : userID }, function (err, docs) {
        if (docs) {

        }
    });
    */
});



module.exports = router;
