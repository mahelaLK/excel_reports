const express = require('express');
const router = express.Router();
const { fetchVprDetail } = require('../../controllers/vprRptControllers/vprController.js');

router.get('/:inwardVoyage', fetchVprDetail);

module.exports = router;