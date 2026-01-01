const express = require('express');
const router = express.Router();
const { fetchGangGen } = require('../../controllers/updateRptControllers/gangPlanDetailGenController.js');

router.get('/:inwardVoyage', fetchGangGen);

module.exports = router;