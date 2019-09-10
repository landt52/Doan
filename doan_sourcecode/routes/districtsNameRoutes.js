const express = require('express');
const districtsNameController = require('../controller/districtsNameController');

const router = express.Router();

router.get('/', districtsNameController.getDistrictsName);

module.exports = router;
