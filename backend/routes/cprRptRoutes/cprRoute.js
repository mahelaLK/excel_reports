const express = require('express');
const { fetchCprDetail } = require('../../controllers/cprRptControllers/cprController');
const router = express.Router();

router.get('/:inwardVoyage', fetchCprDetail);

module.exports = router;