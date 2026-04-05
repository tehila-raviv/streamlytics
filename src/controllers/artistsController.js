const pool = require('../db');

const getTopArtists = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const result = await pool.query(`
      SELECT 
        a.name,
        a.genre,
        a.country,
        SUM(s.play_count) AS total_plays
      FROM artists a
      JOIN songs s ON a.artist_id = s.artist_id
      GROUP BY a.artist_id, a.name, a.genre, a.country
      ORDER BY total_plays DESC
      LIMIT $1
    `, [limit]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        a.*,
        COUNT(s.song_id) AS total_songs,
        SUM(s.play_count) AS total_plays
      FROM artists a
      LEFT JOIN songs s ON a.artist_id = s.artist_id
      WHERE a.artist_id = $1
      GROUP BY a.artist_id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getTopArtists, getArtistById };