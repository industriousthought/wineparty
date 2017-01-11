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

router.post('/hosting/:id', function(req, res, next) {
    party.findOne({_id: req.param('id'), uid: req.user.id}, function(err, party) {
        party.started = {
            attending: []
        };
        party.save(function(err, party) {
            res.send(JSON.stringify(party));
        });
    });

});

router.get('/hosting/', function(req, res, next) {
    var data = {};
    var count = 0;
    var async = function() {
        count++;
        if (count === 1) {
            res.send(data.hosting);
        }
    };
    getHosting(req.user.id, data, async);
});

router.post('/attending/', function(req, res, next) {
    party.findOne({_id: req.body.partyId}, function(err, doc) {
        if (doc && (doc.RSVP.indexOf(req.user.id) >= 0 || doc.uid === req.user.id)) {
            var wine = req.body;
            var ids = [];
            var id = 0;
            doc.wines.forEach(function(currentWine) {
                ids.push(currentWine.id);
            });
            if (ids.length > 0) id = ids.sort()[ids.length - 1] + 1
            wine.id = id;
            wine.uid = req.user.id;
            doc.wines.push(wine);
            doc.save(function(err, doc) {
                console.log(wine);
                res.send(JSON.stringify({
                    status: true,
                    wine: JSON.stringify(wine)
                }));
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

router.post('/deletewine/', function(req, res, next) {
    party.findOne({_id: req.body.partyId}, function(err, party) {
        var index = -1;
        party.wines.forEach(function(wine, i) {
            if (wine.id == req.body.wineId) index = i;
        });
        if (index >= 0 && party.wines[index].uid == req.user.id) {
            party.wines.splice(index, 1);
            party.save();
            res.send(JSON.stringify({status: true}));
        }
    });
});

router.post('/', function(req, res, next) {

    var newParty = new party(req.body);
    newParty.uid = req.user.id;
    newParty.dateTime = new Date(req.body.dateTime);
    newParty.markModified('dateTime');
    newParty.save(function(err, doc) {
        if (err) {
            res.send(JSON.stringify(err));
        } else {
            res.send(JSON.stringify({
                status: true,
                party: JSON.stringify(doc)
            }));
        }
        

    });

});

module.exports = router;
