var Picture = require('../models').Picture;
var moment = require('moment');

function sortedList(category, next) {
  return _listPictures(true, next);
}

function list(category, next) {
  return _listPictures(false, next);
}

function saveNewImage(userId, path, date, next) {
  path = path.toLowerCase().replace('/public', '');

  Picture.findOne({
    path: path
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
    var url = _pathToDirectLink(userId, path);
    console.log(url);

    var pic = new Picture({
      path: path,
      url: url,
      userId: userId,
      name: shortName,
      category: stand,
      date: momentDate
    });

    pic.save(function(err) {
      next(err);
    });
  });
}

function _pathToDirectLink(userId, path) {
  return 'https://dl.dropboxusercontent.com/u/' + userId + path;
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