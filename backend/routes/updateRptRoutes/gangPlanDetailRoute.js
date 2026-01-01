const express = require('express');
const router = express.Router();
const { fetchGangPlanDetail } = require('../../controllers/updateRptControllers/gangPlanDetailController.js');

router.get('/:inwardVoyage', fetchGangPlanDetail);

module.exports = router;
