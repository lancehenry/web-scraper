var mongoose = require('mongoose');

// Save the reference to the Schema constructor
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  body: String
});

// Create the model from the above schema using mongoose
var Note = mongoose.model('Note', NoteSchema);

// Export the Note model
module.exports = Note;