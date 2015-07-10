var mongoose = require('mongoose');
var objectId = mongoose.Schema.ObjectId;
var timestamps = require('mongoose-timestamp');
var paginate = require('mongoose-paginate');

var pictureSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  url: {
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
pictureSchema.plugin(paginate);

module.exports = mongoose.model('Picture', pictureSchema);