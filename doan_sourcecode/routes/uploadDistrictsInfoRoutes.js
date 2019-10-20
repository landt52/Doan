const express = require('express');
const uploadDistrictsModelController = require('./../controller/uploadDistrictsModelController');
const authController = require('./../controller/authController');
const Role = require('./../models/Role');

const router = express.Router();

router.post(
  '/:districtID', authController.authorize, authController.checkCookies, authController.restrict(Role.Admin), uploadDistrictsModelController.uploadDistrictsModel
);

module.exports = router;


