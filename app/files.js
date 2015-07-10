var Dropbox = require('dropbox');
var async = require('async');

var pictureController = require('./pictures');

var appkey = process.env.DBOXKEY;
var appsecret = process.env.DBOXSECRET;
var authtoken = process.env.DBOXTOKEN;

function searchForImages(req, res) {
  var client = new Dropbox.Client({
    key: appkey,
    secret: appsecret,
    token: authtoken,
    sandbox: false
  });

  client.getAccountInfo({}, function(err, account) {
    if (err) {
      return res.send(300, err);
    }

    _syncWithDb(client, account.uid, function(err) {
      if (err) {
        return res.send(300, err);
      } else {
        return res.send(200, "OK");
      }
    });
  });
}

function _syncWithDb(client, userId, next) {
  async.parallel([
    function(cb) {
      console.log('Running images to db..');
      client.search('/Public/', '.png', {
        httpCache: true
      }, function(err, files) {
        if (err) {
          return cb(err);
        }
        _imagesToDb(userId, files, cb);
      });
    },
    function(cb) {
      client.search('/Public/', '.jpeg', {
        httpCache: true
      }, function(err, files) {
        if (err) {
          return cb(err);
        }
        _imagesToDb(userId, files, cb);
      });
    }
  ], function(err) {
    next(err);
  });
}

function _imagesToDb(userId, files, next) {
  async.each(files, function(file, cb) {
      if (file.is_dir) {
        return cb;
      }
      pictureController.saveNewImage(userId, file.path, file.modified, cb);
    },
    function(err) {
      return next(err);
    });
}


module.exports = {};
module.exports.searchForImages = searchForImages;