const express = require('express');
const uploadProvincesModelController = require('../controller/uploadProvincesModelController');

const router = express.Router();

router.post(
  '/:provinceID',
  uploadProvincesModelController.uploadProvincesModel
);

module.exports = router;
