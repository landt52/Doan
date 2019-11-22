const express = require('express');
const boundaryController = require('./../controller/boundaryController');

const router = express.Router();

router.route('/').get(boundaryController.getIcons).patch(boundaryController.updateIcons);
router.get('/icons', boundaryController.getIconsName)

module.exports = router;
