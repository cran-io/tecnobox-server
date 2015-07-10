var Picture = require('../models').Picture;

function sortedList(next) {
  return _listPictures(true, next);
}

function list(next) {
  return _listPictures(false, next);
}

function _listPictures(sort, next) {
  if (sort) {
    Picture.find({}).sort('-date').exec(next);
  } else {
    Picture.find({}).exec(next);
  }
  return;
}


module.exports = {};

module.exports.sortedList = sortedList;
module.exports.list = list;