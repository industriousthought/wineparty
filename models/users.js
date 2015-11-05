var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
      id: String,
      firstName: String,
      lastName: String
});

module.exports = mongoose.model('User', ArticleSchema);
