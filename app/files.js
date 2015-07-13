var Dropbox = require('dropbox');
var async = require('async');
var schedule = require('node-schedule');
var moment = require('moment');

var pictureController = require('./pictures');

var appkey = process.env.DBOXKEY;
var appsecret = process.env.DBOXSECRET;
var authtoken = process.env.DBOXTOKEN;

var lastSyncMoment = moment().subtract(15, 'minutes');

function scheduleSync() {
  if (!_checkValidConfig()) {
    console.log("ERROR!! Missing DropBox app configuration.");
    process.exit();
  }
  console.log('Syncing DropBox with TecnoBox every 15 minutes from now on..');
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

function _checkValidConfig() {
  if (!appkey ||  !appsecret || !authtoken) {
    return false;
  } else {
    return true;
  }
}

function _searchForPictures(next) {
  var client = new Dropbox.Client({
    key: appkey,
    secret: appsecret,
    token: authtoken,
    sandbox: false
  });

  client.getAccountInfo({}, function(err, account) {
    if (err) {
      return next(err);
    }

    _syncWithDb(client, account.uid, function(err) {
      return next(err);
    });
  });
}

function _syncWithDb(client, userId, next) {
  async.parallel([
    function(cb) {
      client.search('/Public/', '.png', {
        httpCache: true
      }, function(err, files) {
        if (err) {
          return cb(err);
        }
        _picturesToDb(userId, files, cb);
      });
    },
    function(cb) {
      client.search('/Public/', '.jpg', {
        httpCache: true
      }, function(err, files) {
        if (err) {
          return cb(err);
        }
        _picturesToDb(userId, files, cb);
      });
    },
    function(cb) {
      client.search('/Public/', '.jpeg', {
        httpCache: true
      }, function(err, files) {
        if (err) {
          return cb(err);
        }
        _picturesToDb(userId, files, cb);
      });
    }
  ], function(err) {
    next(err);
  });
}

function _picturesToDb(userId, files, next) {
  async.each(files, function(file, cb) {
      if (file.is_dir) {
        return cb;
      }
      pictureController.saveNewPicture(userId, file.path, file.modified, cb);
    },
    function(err) {
      return next(err);
    });
}


module.exports = {};
module.exports.triggerSync = triggerSync;
module.exports.scheduleSync = scheduleSync;