const pool = require('../db');

const logPlay = async (req, res) => {
  try {
    const { user_id, song_id, duration_played } = req.body;

    if (!user_id || !song_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'user_id and song_id are required' 
      });
    }

    const userCheck = await pool.query(
      'SELECT user_id FROM users WHERE user_id = $1', [user_id]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const songCheck = await pool.query(
      'SELECT song_id FROM songs WHERE song_id = $1', [song_id]
    );
    if (songCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Song not found' });
    }

    const result = await pool.query(`
      INSERT INTO plays (user_id, song_id, duration_played)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [user_id, song_id, duration_played || null]);

    await pool.query(`
      UPDATE songs SET play_count = play_count + 1
      WHERE song_id = $1
    `, [song_id]);

    res.status(201).json({
      success: true,
      message: 'Play logged successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getRecentPlays = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.play_id,
        u.username,
        s.title AS song,
        a.name AS artist,
        p.played_at,
        p.duration_played
      FROM plays p
      JOIN users u ON p.user_id = u.user_id
      JOIN songs s ON p.song_id = s.song_id
      JOIN artists a ON s.artist_id = a.artist_id
      ORDER BY p.played_at DESC
      LIMIT 10
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { logPlay, getRecentPlays };