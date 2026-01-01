const express = require('express');
const router = express.Router();
const { fetchGangCar } = require('../../controllers/updateRptControllers/gangPlanDetailCarController.js');

router.get('/:inwardVoyage', fetchGangCar);

module.exports = router;