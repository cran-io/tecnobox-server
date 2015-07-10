var Dropbox = require('dropbox');

var appkey = process.env.DBOXKEY ||  'shyctyr7eiihjiy';
var appsecret = process.env.DBOXSECRET || 'e9skh7xc63jwabs';
var authtoken = 'hX8Q7Bjh6AAAAAAAAAAA_JgoCxpJLObbNLj5yS4zb7UW93HOHu7YplM4GrEFK1F3';

var client;

function prepareDropBox(req, res) {
  client = new Dropbox.Client({
    key: appkey,
    secret: appsecret,
    token: authtoken,
    sandbox: false
  });
  check(req, res);
}

function check(req, res) {
  client.readdir('/Public/', function(status, reply) {
    console.log(status)
    console.log(reply)
    res.send(200, JSON.stringify(reply));
  });
}

function _readdir(next) {
  var client = app.client(accesstoken);
  client.readdir("/", function(err, entries) {
    if (err) {
      throw err;
    }
    console.log(entries);
    next(err, entries);
  });
}

function actionOAuthStep1(req, res) {
  _OAuth1(function(err, status, request_token) {
    res.send(status, {
      message: 'open ' + request_token.authorize_url + ' and authorize the app. Then go to step 2.'
    });
  });
}

function actionOAuthStep2(req, res) {
  _OAuth2(function(err, status, access_token) {
    res.send(status, {
      token: access_token
    });
  });
}

function _OAuth1(next) {
  app.requesttoken(function(status, request_token) {
    console.log(request_token);
    next(null, status, request_token);
  });
}

function _OAuth2(next) {
  var rq = {
    oauth_token_secret: 'xcHUs0T8yVZUi9Kd',
    oauth_token: 'jIA7MRBv5Ztajg3q',
    authorize_url: 'https://www.dropbox.com/1/oauth/authorize?oauth_token=jIA7MRBv5Ztajg3q'
  };
  app.accesstoken(rq, function(status, access_token) {
    console.log(access_token);
    next(null, status, access_token);
  });
}

module.exports = {};
module.exports.prepareDropBox = prepareDropBox;
module.exports.check = check;
module.exports.actionOAuthStep1 = actionOAuthStep1;
module.exports.actionOAuthStep2 = actionOAuthStep2;