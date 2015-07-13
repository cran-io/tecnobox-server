var express = require('express');
var router = express.Router();

var filesController = require('../app').filesController;
var picturesController = require('../app').picturesController;


//Triggers a sync pictures files with the DB
router.get('/sync', filesController.triggerSync);

//Returns all the pictures urls
router.get('/pictures', picturesController.sortedList);

module.exports = router;