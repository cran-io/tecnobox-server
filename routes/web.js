var express = require('express');
var router = express.Router();

var filesController = require('../app').filesController;
var picturesController = require('../app').picturesController;


//Triggers a sync of PNGs and JPEGs files with the DB
router.get('/sync', filesController.searchForImages);

//Prints the Dropbox UserId
router.get('/user', filesController.getUserId);

//Returns all the images urls
router.get('/images', picturesController.sortedList);

//Returns all the images urls from a specific category
router.get('/images/:category', picturesController.sortedList);

module.exports = router;