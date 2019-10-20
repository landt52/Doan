const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');
const Role = require('./../models/Role');

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(
    authController.authorize, authController.checkCookies,
    authController.restrict(Role.Admin),
    reviewController.getAllReviews
  )
  .post(authController.authorize, authController.checkCookies, reviewController.createReview);

router
  .route('/:id')
  .get(authController.authorize, authController.checkCookies, reviewController.getReview)
  .patch(authController.authorize, authController.checkCookies, reviewController.updateReview)
  .delete(authController.authorize, authController.checkCookies, reviewController.deleteReview);

module.exports = router;