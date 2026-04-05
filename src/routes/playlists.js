const express = require('express');
const router = express.Router();
const { getPlaylistInsights, getAllPlaylists } = require('../controllers/playlistsController');

router.get('/', getAllPlaylists);
router.get('/:id/insights', getPlaylistInsights);

module.exports = router;