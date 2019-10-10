const express = require('express');
const citiesNameController = require('./../controller/citiesNameController');

const router = express.Router();

router.get('/', citiesNameController.getCitiesName);

module.exports = router;