var Dropbox = require('dropbox');
var async = require('async');

var pictureController = require('./pictures');

var appkey = process.env.DBOXKEY ||  'shyctyr7eiihjiy';
var appsecret = process.env.DBOXSECRET || 'e9skh7xc63jwabs';
var authtoken = process.env.DBOXTOKEN ||  'hX8Q7Bjh6AAAAAAAAAAA_JgoCxpJLObbNLj5yS4zb7UW93HOHu7YplM4GrEFK1F3';


function getUserId(req, res) {
  var client = new Dropbox.Client({
    key: appkey,
    secret: appsecret,
    token: authtoken,
    sandbox: false
  });

  client.getAccountInfo({}, function(err, account) {
    console.log(account.uid);
    res.send(200, account.uid);
  });

}

function searchForImages(req, res) {
  var client = new Dropbox.Client({
    key: appkey,
    secret: appsecret,
    token: authtoken,
    sandbox: false
  });

  async.parallel([
    function(cb) {
      console.log('Running images to db..');
      client.search('/Public/', '.png', {
        httpCache: true
      }, function(err, files) {
        if (err) {
          return cb(err);
        }
        _imagesToDb(files, cb);
      });
    },
    function(cb) {
      client.search('/Public/', '.jpeg', {
        httpCache: true
      }, function(err, files) {
        if (err) {
          return cb(err);
        }
        _imagesToDb(files, cb);
      });
    }
  ], function(err) {
    if (err) {
      return res.send(300, err);
    } else {
      return res.send(200, "OK");
    }
  });
}

function _imagesToDb(files, next) {
  async.each(files, function(file, cb) {
      if (file.is_dir) {
        return cb;
      }
      pictureController.saveNewImage(file.path, file.modified, cb);
    },
    function(err) {
      return next(err);
    });
}


module.exports = {};
module.exports.searchForImages = searchForImages;
module.exports.getUserId = getUserId;