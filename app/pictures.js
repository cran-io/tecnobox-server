var Picture = require('../models').Picture;
var moment = require('moment');
var _ = require('underscore');

function sortedList(req, res) {
  var category = req.query.category;
  if (!category) {
    category = null;
  }
  _listPictures(category, true, req.query.page, req.query.limit, function(err, pictures) {
    if (err) {
      res.send(300, err);
    } else {
      var urls = _.pluck(pictures, 'url');
      res.json(urls);
    }
  });
}

function list(req, res) {
  var category = req.query.category;
  if (!category) {
    category = null;
  }
  _listPictures(category, null, req.query.page, req.query.limit, function(err, pictures) {
    if (err) {
      res.send(300, err);
    } else {
      var urls = _.pluck(pictures, 'url');
      res.json(urls);
    }
  });
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
      stand = "unknown";
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

function _listPictures(category, sort, page, limit, next) {
  var query = {};
  if (category) {
    query = {
      category: category.toLowerCase()
    };
  }

  if (sort) {
    sort = {
      date: -1
    };
  }

  Picture.paginate(query, {
    page: page,
    limit: limit,
    sortBy: sort
  }, function(err, results, pageCount, itemCount) {
    next(err, results);
  });
}


module.exports = {};

module.exports.saveNewImage = saveNewImage;
module.exports.sortedList = sortedList;
module.exports.list = list;