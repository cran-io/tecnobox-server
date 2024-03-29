var async = require('async');
var schedule = require('node-schedule');
var moment = require('moment');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var pictureController = require('./pictures');

var lastSyncMoment = moment().subtract(15, 'minutes');
var lastKeyUsed;

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function scheduleSync() {
  console.log('Syncing Amazon S3 with TecnoBox every 15 minutes from now on..');
  var j = schedule.scheduleJob('*/15 * * * *', function() {
    pictureController.doMaintenance();
    _searchForPictures(function(err) {
      console.log('> Syncing started. Last was ' + lastSyncMoment.from(moment()));
      if (err) {
        console.log('Sync failed! check for error: ' + err.message);
      } else {
        lastSyncMoment = moment();
        console.log('Sync completed at ' + lastSyncMoment.format('LT'));
      }
    });
  });
}

function triggerSync(req, res) {
  var fiveFromNow = moment().subtract(5, 'minutes');
  var allowed = lastSyncMoment.isBefore(fiveFromNow);
  if (!allowed) {
    return res.status(300).send('Not allowed. Wait at least 5 minutes.');
  }
  pictureController.doMaintenance();
  _searchForPictures(function(err) {
    if (err) {
      return res.status(300).send(err);
    } else {
      lastSyncMoment = moment();
      return res.status(200).send('Sync completed at ' + lastSyncMoment.format('LT'));
    }
  });
}

function _searchForPictures(cb) {
  listAllKeys("", [], function(keys) {
    _picturesToDb(keys, cb);
  });
}

function listAllKeys(marker, keys, cb) {
  s3.listObjects({Bucket: "turismo-site", Prefix: "sources/", Marker: marker, EncodingType: "url"}, function(err, data) {
    var new_keys = keys.concat(data.Contents);
    lastKeyUsed = data.Contents.slice(-1)[0].Key;
    if(data.IsTruncated) {
      listAllKeys(lastKeyUsed, new_keys, cb);
    } else {
      cb(new_keys);
    }
  });
}

function _picturesToDb(keys, next) {
  async.each(keys, function(key, cb) {
    var keyName = key.Key;
    if (keyName.endsWith(".jpg") || keyName.endsWith(".png") || keyName.endsWith(".jpeg")) {
      pictureController.saveNewPicture(keyName, key.LastModified, cb);
    } else {
      return cb(null);
    }
  },
  function(err) {
    return next(err);
  });
}


module.exports = {};
module.exports.triggerSync = triggerSync;
module.exports.scheduleSync = scheduleSync;
