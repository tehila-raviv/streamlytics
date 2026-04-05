const pool = require('../db');

const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    const userCheck = await pool.query(
      'SELECT * FROM users WHERE user_id = $1', [id]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const statsResult = await pool.query(`
      WITH user_plays AS (
        SELECT
          p.play_id,
          p.played_at,
          p.duration_played,
          s.title,
          s.duration_seconds,
          a.name AS artist,
          a.genre
        FROM plays p
        JOIN songs s ON p.song_id = s.song_id
        JOIN artists a ON s.artist_id = a.artist_id
        WHERE p.user_id = $1
      )
      SELECT
        COUNT(play_id) AS total_plays,
        COUNT(DISTINCT artist) AS unique_artists,
        COALESCE(SUM(duration_played), 0) AS total_seconds_listened,
        COALESCE(ROUND(AVG(duration_played)), 0) AS avg_play_duration,
        MODE() WITHIN GROUP (ORDER BY genre) AS favorite_genre,
        MODE() WITHIN GROUP (ORDER BY artist) AS favorite_artist
      FROM user_plays
    `, [id]);

    const recentResult = await pool.query(`
      SELECT
        s.title,
        a.name AS artist,
        p.played_at
      FROM plays p
      JOIN songs s ON p.song_id = s.song_id
      JOIN artists a ON s.artist_id = a.artist_id
      WHERE p.user_id = $1
      ORDER BY p.played_at DESC
      LIMIT 5
    `, [id]);

    res.json({
      success: true,
      data: {
        user: userCheck.rows[0],
        stats: statsResult.rows[0],
        recently_played: recentResult.rows
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.user_id,
        u.username,
        u.country,
        COUNT(p.play_id) AS total_plays
      FROM users u
      LEFT JOIN plays p ON u.user_id = p.user_id
      GROUP BY u.user_id, u.username, u.country
      ORDER BY total_plays DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getUserStats, getAllUsers };