const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updatePassword', authController.authorize, authController.updatePassword);
router.patch('/updateInfo', authController.authorize, userController.updateInfo);
router.delete('/deactivateUser', authController.authorize, userController.deactivateUser);

router.route('/').get(userController.getAllUsers);

// router.route('/:id')
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser);

module.exports = router;