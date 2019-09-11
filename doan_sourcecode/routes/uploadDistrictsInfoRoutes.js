const express = require('express');
const uploadDistrictsModelController = require('../controller/uploadDistrictsModelController');

const router = express.Router();

router.post(
  '/:districtID',
  uploadDistrictsModelController.uploadDistrictsModel
);

module.exports = router;


