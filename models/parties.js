var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
      id: String,
      host: String,
      invited: String,
      RSVP: String,
      date: Date,
      location: String
});

module.exports = mongoose.model('Party', ArticleSchema);
