const express = require('express');
const router = express.Router();
const { logPlay, getRecentPlays } = require('../controllers/playsController');
const authenticateToken = require('../middleware/auth');

router.get('/recent', getRecentPlays);
router.post('/', authenticateToken, logPlay);

module.exports = router;