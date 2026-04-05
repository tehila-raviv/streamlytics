const express = require('express');
const router = express.Router();
const { getTrendingSongs, getSongById, searchSongs } = require('../controllers/songsController');

router.get('/trending', getTrendingSongs);
router.get('/search', searchSongs);
router.get('/:id', getSongById);

module.exports = router;