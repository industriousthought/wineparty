var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
      id: String,
      uid: String,
      RSVP: [],
      invites: [],
      started: {},
      wines: [],
      dateTime: Date,
      location: String
});

module.exports = mongoose.model('Party', ArticleSchema);
