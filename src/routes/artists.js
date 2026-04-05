const express = require('express');
const router = express.Router();
const { getTopArtists, getArtistById } = require('../controllers/artistsController');

router.get('/top', getTopArtists);
router.get('/:id', getArtistById);

module.exports = router;