var express = require('express');
var router = express.Router();

var filesController = require('../app').filesController;
var picturesController = require('../app').picturesController;


//Triggers a sync pictures files with the DB
router.get('/sync', filesController.triggerSync);
router.get('/sync_image', filesController.triggerImageSync);

//Returns all the pictures urls
router.get('/pictures', picturesController.sortedList);
router.get('/source_picture', picturesController.pictureURL);

module.exports = router;
