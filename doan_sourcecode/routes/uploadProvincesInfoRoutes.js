const express = require('express');
const uploadProvincesModelController = require('../controller/uploadProvincesModelController');
const provinceDataController = require('../controller/provinceDataController');

const router = express.Router();

router.post(
  '/:provinceID',
  uploadProvincesModelController.uploadProvincesModel
);

router.post(
  '/edit/:provinceID',
  uploadProvincesModelController.editProvinceModel
);

router.get('/data/:provinceID', provinceDataController.getProvinceInfo)

module.exports = router;
