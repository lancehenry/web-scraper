var mongoose = require('mongoose');

// Save the reference to the Schema contstructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }
});

// Create the model from the above schema, using mongoose
var Article = mongoose.model('Article', ArticleSchema);

// Export the Article model
module.exports = Article;
