
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/webControllers/indexController');

router.get('/', indexController.getIndex);
router.get('/about', indexController.getAbout);
 

module.exports = router;
