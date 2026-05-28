const express = require('express');
const router = express.Router();
const { getStats, getRecentRegistrations, getMostRegisteredCourses } = require('../controllers/dashboardController');

router.get('/stats', getStats);
router.get('/recent', getRecentRegistrations);
router.get('/top-courses', getMostRegisteredCourses);

module.exports = router;
