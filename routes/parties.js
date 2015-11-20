var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var party = require('../models/parties.js');

var getHosting = function(userID, data, async) {
    party.find({ uid: userID }, function (err, docs) {
        if (docs) {
            data.hosting = JSON.stringify(docs);
            async();
        } else {
            data.hosting = JSON.stringify({ status: false });
            async();
        }
    });
};

var getInvited = function(userID, data, async) {
    party.find({ invites: userID }, function (err, docs) {
        if (docs) {
            docs = docs.map(function(item) {
                item = item.toObject();
                item.type = 'invite';
                item.name = item.location;
                return item;
            });
            data.invited = JSON.stringify(docs);
            async();
        } else {
            data.invited = JSON.stringify({ status: false });
            async();
        }
    });
};

var getRSVP = function(userID, data, async) {
    party.find({ RSVP: userID }, function (err, docs) {
        if (docs) {
            docs = docs.map(function(item) {
                item = item.toObject();
                item.type = 'RSVP';
                item.name = item.location;
                return item;
            });
            data.RSVP = JSON.stringify(docs);
            async();
        } else {
            data.RSVP = JSON.stringify({ status: false });
            async();
        }
    });
};

router.get('/', function(req, res, next) {
    var data = {};
    var count = 0;
    var async = function() {
        count++;
        if (count === 3) {
            console.log(data);
            res.send(data);
        }
    };
    getHosting(req.user.id, data, async);
    getRSVP(req.user.id, data, async);
    getInvited(req.user.id, data, async);

});

router.get('/hosting/', function(req, res, next) {
    var data = {};
    var count = 0;
    var async = function() {
        count++;
        if (count === 1) {
            console.log(data);
            res.send(data.hosting);
        }
    };
    getHosting(req.user.id, data, async);
});

router.post('/attending/:id', function(req, res, next) {
    party.findOne({_id: req.param('id')}, function(err, doc) {
        if (doc.RSVP.indexOf(req.user.id) >= 0) {
            var wine = req.body;
            wine.uid = req.user.id;
            doc.wines.push(wine);
            doc.save(function(err, doc) {
                res.send(JSON.stringify({status: true}));
            });
        }
    });
});

router.get('/attending/', function(req, res, next) {
    var data = {};
    var count = 0;
    var async = function() {
        count++;
        if (count === 1) {
            console.log(data);
            res.send(data.RSVP);
        }
    };
    getRSVP(req.user.id, data, async);
});


router.get('/invited', function(req, res, next) {
    var data = {};
    var count = 0;
    var async = function() {
        count++;
        if (count === 1) {
            console.log(data);
            res.send(data.invited);
        }
    };
    getInvited(req.user.id, data, async);
});

router.post('/invited/:id', function(req, res, next) {
    party.findOne({_id: req.param('id')}, function(err, doc) {
        if (doc) {
            doc.invites.splice(doc.invites.indexOf(req.user.id), 1);
            doc.RSVP.push(req.user.id);
            doc.save(function(err, doc) {
                res.send(JSON.stringify({status: true}));
            });
        } else {
            res.send(JSON.stringify({status: false}));
        }
    });
});

router.post('/delete/:id', function(req, res, next) {
    party.find({_id: req.param('id'), uid: req.user.id}).remove( function() {
        res.send(JSON.stringify({status: true}));
    });
});

router.post('/', function(req, res, next) {

    var newParty = new party(req.body);
    newParty.uid = req.user.id;
    newParty.dateTime = new Date(req.body.dateTime);
    newParty.markModified('dateTime');
    newParty.save(function(err) {
        if (err) {
            res.send(JSON.stringify(err));
        } else {
            res.send(JSON.stringify({status: true}));
        }
        

    });

});

module.exports = router;
