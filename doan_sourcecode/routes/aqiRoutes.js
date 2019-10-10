const express = require('express');
const aqiController = require('./../controller/aqiController');
const authController = require('./../controller/authController');
const Role = require('./../models/Role');

const router = express.Router();

router.get('/', authController.authorize, aqiController.getAqi);

module.exports = router;
