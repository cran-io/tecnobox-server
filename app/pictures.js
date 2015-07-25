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
      res.json(picture.url);
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
      var urls = _.pluck(pictures, 'url');
      res.json(urls);
    }
  });
}

function saveNewPicture(userId, path, date, next) {
  path = path.toLowerCase().replace('/public', '');

  Picture.findOne({
    path: path
  }, function(err, pictureExists) {
    if (err || pictureExists) {
      return next(err);
    }
    var shortName = path.lastIndexOf('/') + 1;
    shortName = path.substring(shortName);
    var thumbnail = 'public/thumbnails/' + shortName;

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

    request.get(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        sharp(new Buffer(body))
          .resize(500, 280)
          .toFormat('jpeg')
          .toFile(thumbnail, function(err, data) {
            if (!err) {
              pic.thumbnail = 'thumbnails/' + shortName;
              pic.save();
            }
          });
      }
    });

    pic.save(function(err) {
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
      request.head(p.url, function(error, response, body) {
        if (!error && response.statusCode == 404) {
          p.remove(function(err) {});
        }
      })
    })
  })
}

function _pathToDirectLink(userId, path) {
  return 'https://dl.dropboxusercontent.com/u/' + userId + path;
}

function _listPictures(category, sort, page, limit, next) {
  var query = {thumbnail: { $exists: true }};
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
    console.log(results);
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
