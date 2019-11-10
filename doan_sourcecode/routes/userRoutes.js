const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const Role = require('./../models/Role');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updatePassword', authController.authorize, authController.checkCookies, authController.updatePassword);
router.patch('/updateInfo', authController.authorize, authController.checkCookies, userController.updateInfo);
router.patch('/changeAvatar', authController.authorize, authController.checkCookies, userController.changeAvatar);
router.delete(
  '/deactivateUser/:id',
  authController.authorize,
  authController.checkCookies,
  authController.restrict(Role.Admin),
  userController.deactivateUser
);
router.get('/getRole', authController.authorize, authController.getRole);

router.get('/myInfo', authController.authorize, authController.checkCookies, userController.getInfo)
router.get(
  '/myLocations',
  authController.authorize,
  authController.checkCookies,
  userController.getMyLocations
);

router.get(
  '/myReviews',
  authController.authorize,
  authController.checkCookies,
  userController.getMyReviews
);

router
  .route('/')
  .get(
    authController.authorize, authController.checkCookies,
    authController.restrict(Role.Admin), 
    userController.getAllUsers
  );

router
  .route('/:id')
  .get(
    authController.authorize, authController.checkCookies,
    authController.restrict(Role.Admin),
    userController.getUser
  )
  .patch(
    authController.authorize, authController.checkCookies,
    authController.restrict(Role.Admin),
    userController.updateUser
  )
  .delete(
    authController.authorize, authController.checkCookies,
    authController.restrict(Role.Admin),
    userController.deleteUser
  );

module.exports = router;