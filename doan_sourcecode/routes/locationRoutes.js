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

router
  .route('/isPending')
  .get(
    authController.authorize,
    authController.checkCookies,
    authController.restrict(Role.Admin),
    locationController.getPendingLocation
  );

router.route('/type/:locationType').get(locationController.getLocationsByType);

router.route('/types/types').get(locationController.getLocationTypes);

router
  .route('/:locationId')
    .get(locationController.getLocationInfo)
    .patch(authController.authorize, authController.checkCookies, locationController.updateLocation)
    .delete(authController.authorize, authController.checkCookies, locationController.deleteLocation);

router
  .route('/approve/:locationId')
    .patch(
      authController.authorize,
      authController.checkCookies,
      authController.restrict(Role.Admin),
      locationController.approveLocation
    );

router
  .route('/reject/:locationId')
    .delete(
      authController.authorize,
      authController.checkCookies,
      authController.restrict(Role.Admin),
      locationController.rejectLocation
    );

router.get('/:distance/center/:latlng', locationController.getLocationWithin);

module.exports = router;
