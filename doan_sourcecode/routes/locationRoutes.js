const express = require('express');
const locationController = require('./../controller/locationController');
const reviewRouter = require('./../routes/reviewRoutes');
const authController = require('./../controller/authController');
const Role = require('./../models/Role');

const router = express.Router();

router.use('/:locationId/reviews', reviewRouter);

router
  .route('/')
  .get(
    authController.authorize,
    authController.checkCookies,
    authController.restrict(Role.Admin),
    locationController.getAllLocations
  )
  .post(
    authController.authorize,
    authController.checkCookies,
    locationController.createLocation
  );

router.route('/type/:locationType').get(locationController.getLocationsByType);

router.route('/types/types').get(locationController.getLocationTypes);

router
  .route('/:locationId')
    .get(locationController.getLocationInfo)
    .patch(authController.authorize, authController.checkCookies, locationController.updateLocation)
    .delete(authController.authorize, authController.checkCookies, locationController.deleteLocation);

router.get('/:distance/center/:latlng', locationController.getLocationWithin);

module.exports = router;
