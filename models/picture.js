var mongoose = require('mongoose');
var objectId = mongoose.Schema.ObjectId;
var timestamps = require('mongoose-timestamp');

var pictureSchema = new mongoose.Schema({
  fullpath: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

pictureSchema.plugin(timestamps);

module.exports = mongoose.model('Picture', pictureSchema);