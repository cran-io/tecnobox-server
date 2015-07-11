var express = require('express');
var router = express.Router();

var filesController = require('../app').filesController;
var picturesController = require('../app').picturesController;


//Triggers a sync of PNGs and JPEGs files with the DB
router.get('/sync', filesController.triggerSync);

//Returns all the images urls
router.get('/images', picturesController.sortedList);

module.exports = router;