const express = require('express');
const router = express.Router();
const { getUserStats, getAllUsers } = require('../controllers/usersController');

router.get('/', getAllUsers);
router.get('/:id/stats', getUserStats);

module.exports = router;