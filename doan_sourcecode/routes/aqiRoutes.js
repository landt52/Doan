const express = require('express');
const aqiController = require('./../controller/aqiController');

const router = express.Router();

router.get('/', aqiController.getAqi);

module.exports = router;
