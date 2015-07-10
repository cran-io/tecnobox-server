var express = require('express');
var router = express.Router();

var filesController = require('../app').filesController;


router.get('/prepare', filesController.searchForImages);

router.get('/user', filesController.getUserId);

module.exports = router;