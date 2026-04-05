const pool = require('../db');

const getPlaylistInsights = async (req, res) => {
  try {
    const { id } = req.params;

    const playlistCheck = await pool.query(
      'SELECT * FROM playlists WHERE playlist_id = $1', [id]
    );
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    const songsResult = await pool.query(`
      SELECT
        s.title,
        a.name AS artist,
        a.genre,
        s.duration_seconds,
        s.play_count,
        ps.position,
        ps.added_at
      FROM playlist_songs ps
      JOIN songs s ON ps.song_id = s.song_id
      JOIN artists a ON s.artist_id = a.artist_id
      WHERE ps.playlist_id = $1
      ORDER BY ps.position
    `, [id]);

    const statsResult = await pool.query(`
      WITH playlist_data AS (
        SELECT
          s.duration_seconds,
          s.play_count,
          a.genre
        FROM playlist_songs ps
        JOIN songs s ON ps.song_id = s.song_id
        JOIN artists a ON s.artist_id = a.artist_id
        WHERE ps.playlist_id = $1
      )
      SELECT
        COUNT(*) AS total_songs,
        SUM(duration_seconds) AS total_duration_seconds,
        ROUND(AVG(play_count)) AS avg_song_popularity,
        MAX(play_count) AS most_popular_play_count,
        MODE() WITHIN GROUP (ORDER BY genre) AS top_genre
      FROM playlist_data
    `, [id]);

    res.json({
      success: true,
      data: {
        playlist: playlistCheck.rows[0],
        insights: statsResult.rows[0],
        songs: songsResult.rows
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getAllPlaylists = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.playlist_id,
        p.name,
        p.is_public,
        u.username AS owner,
        COUNT(ps.song_id) AS total_songs,
        p.created_at
      FROM playlists p
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
      GROUP BY p.playlist_id, p.name, p.is_public, u.username, p.created_at
      ORDER BY total_songs DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getPlaylistInsights, getAllPlaylists };