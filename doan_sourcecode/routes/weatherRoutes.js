const express = require('express');
const aqiController = require('./../controller/aqiController');

const router = express.Router();

router.get('/', aqiController.getWeather);

module.exports = router;
