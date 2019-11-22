const express = require('express');
const boundaryController = require('./../controller/boundaryController');

const router = express.Router();

router.get('/', boundaryController.getVnBoundaries);
router.get('/:provinceBoundary', boundaryController.getProvinceBoundary);
router.get('/icons', boundaryController.getIcons);

module.exports = router;
