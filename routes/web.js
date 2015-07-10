var express = require('express');
var router = express.Router();

var filesController = require('../app').filesController;

/* GET: Test login.*/
router.get('/oauth1', filesController.actionOAuthStep1);
router.get('/oauth2', filesController.actionOAuthStep2);

router.get('/check', filesController.check);
router.get('/prepare', filesController.prepareDropBox);


module.exports = router;