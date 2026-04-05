const pool = require('../db');

const getTrendingSongs = async (req, res) => {
  try {
    const result = await pool.query(`
      WITH song_plays AS (
        SELECT
          s.song_id,
          s.title,
          a.name AS artist,
          s.play_count,
          COUNT(p.play_id) AS recent_plays
        FROM songs s
        JOIN artists a ON s.artist_id = a.artist_id
        LEFT JOIN plays p ON s.song_id = p.song_id
          AND p.played_at >= NOW() - INTERVAL '7 days'
        GROUP BY s.song_id, s.title, a.name, s.play_count
      )
      SELECT
        title,
        artist,
        play_count,
        recent_plays,
        RANK() OVER (ORDER BY recent_plays DESC) AS trend_rank
      FROM song_plays
      ORDER BY trend_rank
      LIMIT 5
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT
        s.*,
        a.name AS artist,
        a.genre
      FROM songs s
      JOIN artists a ON s.artist_id = a.artist_id
      WHERE s.song_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Song not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const searchSongs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Query parameter q is required' });

    const result = await pool.query(`
      SELECT
        s.song_id,
        s.title,
        a.name AS artist,
        s.release_year,
        s.play_count
      FROM songs s
      JOIN artists a ON s.artist_id = a.artist_id
      WHERE s.title ILIKE $1 OR a.name ILIKE $1
      ORDER BY s.play_count DESC
    `, [`%${q}%`]);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getTrendingSongs, getSongById, searchSongs };