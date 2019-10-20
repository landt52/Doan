const express = require('express');
const uploadProvincesModelController = require('./../controller/uploadProvincesModelController');
const provinceDataController = require('./../controller/provinceDataController');
const authController = require('./../controller/authController');
const Role = require('./../models/Role');

const router = express.Router();

router.post(
  '/:provinceID',
  authController.authorize, authController.checkCookies,
  authController.restrict(Role.Admin),
  uploadProvincesModelController.uploadProvincesModel
);

router.post(
  '/edit/:provinceID',
  authController.authorize, authController.checkCookies,
  authController.restrict(Role.Admin),
  uploadProvincesModelController.editProvinceModel
);

router.post(
  '/picture/:provinceID',
  authController.authorize, authController.checkCookies,
  authController.restrict(Role.Admin),
  uploadProvincesModelController.uploadProvincePicture
);

router.get('/data/:provinceID', provinceDataController.getProvinceInfo)

module.exports = router;
