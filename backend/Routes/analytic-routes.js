const {getAnalytics} = require('../Controllers/admin-analytic-controller');
const express = require('express');
const router = express.Router();

// Admin Analytics Endpoint
router.get('/analytics', getAnalytics);

module.exports = router;