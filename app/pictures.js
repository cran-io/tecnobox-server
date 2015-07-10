var Picture = require('../models').Picture;
var moment = require('moment');

function sortedList(next) {
  return _listPictures(true, next);
}

function list(next) {
  return _listPictures(false, next);
}

function saveNewImage(path, date, next) {
  Picture.findOne({
    boxpath: path
  }, function(err, pictureExists) {
    if (err || pictureExists) {
      return next(err);
    }

    var shortName = path.lastIndexOf('/') + 1;
    shortName = path.substring(shortName);

    var stand = shortName.indexOf('_') + 1;
    if (stand != 0) {
      stand = shortName.substring(0, stand).toLowerCase();
    } else {
      stand = "UNKNOWN";
    }

    var momentDate = moment(date).format();

    var pic = new Picture({
      boxpath: path,
      name: shortName,
      category: stand,
      date: momentDate
    });

    pic.save(function(err) {
      next(err);
    });
  });
}

function _convertToDirectLink(path, next) {
  var url = 'https://dl.dropboxusercontent.com/u/443545873/carpeta/otracarpeta/alfff.jpg';
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

module.exports.saveNewImage = saveNewImage;
module.exports.sortedList = sortedList;
module.exports.list = list;