var mongoose = require('mongoose');

var WineSchema = new mongoose.Schema({
      id: String,
      uid: String,
      partyID: String,
      name: String
});

module.exports = mongoose.model('Party', WineSchema);
