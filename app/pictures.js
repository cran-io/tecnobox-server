var Picture = require('../models').Picture;
var moment = require('moment');
var _ = require('underscore');
var async = require('async');
var request = require('request');
var sharp = require('sharp');
var request = require('request').defaults({
  encoding: null
});

function sortedList(req, res) {
  var category = req.query.category;
  if (!category) {
    category = null;
  }
  _listPictures(category, true, req.query.page, req.query.limit, function(err, pictures) {
    if (err) {
      res.send(300, err);
    } else {
      var urls = _.pluck(pictures, 'thumbnail');
      res.json(urls);
    }
  });
}

function pictureURL(req, res) {
  var thumbnail = req.query.thumbnail;

  if (!thumbnail) {
    res.send(300, "Missing thumbnail");
  }

  _getPictureWithThumbnail(thumbnail, function(err, picture) {
    if (err) {
      res.send(300, err);
    } else {
      res.json(picture.path);
    }
  })
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
      var urls = _.pluck(pictures, 'path');
      res.json(urls);
    }
  });
}

function saveNewPicture(key, date, next) {
  var path = _pathToDirectLink(key);
  Picture.findOne({
    path: path
  }, function(err, pictureExists) {
    if (err || pictureExists) {
      return next(err);
    }

    var shortName = key.substring(key.lastIndexOf('/') + 1);
    var thumbnail = _pathToDirectLink('thumbnails/' + shortName);

    var stand = shortName.indexOf('_');
    if (stand > 0) {
      stand = shortName.substring(0, stand).toLowerCase();
    } else {
      stand = "unknown";
    }

    var momentDate = moment(date).format();

    var pic = new Picture({
      path: path,
      name: shortName,
      category: stand,
      date: momentDate,
      thumbnail: thumbnail
    });

    pic.save(function(err, picture) {
      next(err);
    });
  });
}

function doMaintenance() {
  Picture.find({}, function(err, pictures) {
    if (err) {
      return;
    }
    async.each(pictures, function(p, cb) {
      request.head(p.path, function(error, response, body) {
        if (!error && response.statusCode == 404) {
          p.remove(function(err) {});
        }
      })
    })
  })
}

function _pathToDirectLink(key) {
  return 'https://s3-sa-east-1.amazonaws.com/turismo-site/' + key;
}

function _listPictures(category, sort, page, limit, next) {
  var query = {thumbnail: { $exists: true }};
  if (category) {
    query['category'] = category.toLowerCase()
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

function _getPictureWithThumbnail(thumbnail, next) {
  var query = {thumbnail: thumbnail}
  Picture.findOne(query, next);
}

module.exports = {};

module.exports.saveNewPicture = saveNewPicture;
module.exports.pictureURL = pictureURL;
module.exports.doMaintenance = doMaintenance;
module.exports.sortedList = sortedList;
module.exports.list = list;
