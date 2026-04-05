INSERT INTO artists (name, genre, country) VALUES
('Taylor Swift', 'Pop', 'USA'),
('Drake', 'Hip-Hop', 'Canada'),
('Bad Bunny', 'Reggaeton', 'Puerto Rico'),
('Adele', 'Soul', 'UK'),
('The Weeknd', 'R&B', 'Canada');

INSERT INTO songs (title, artist_id, duration_seconds, release_year, play_count) VALUES
('Shake It Off', 1, 219, 2014, 1500000),
('Blank Space', 1, 231, 2014, 1200000),
('God''s Plan', 2, 198, 2018, 2000000),
('Hotline Bling', 2, 267, 2015, 1800000),
('Mia', 3, 204, 2018, 900000),
('Hello', 4, 295, 2015, 2500000),
('Rolling in the Deep', 4, 228, 2010, 3000000),
('Blinding Lights', 5, 200, 2019, 2800000),
('Starboy', 5, 230, 2016, 1600000),
('Anti-Hero', 1, 200, 2022, 3200000);

INSERT INTO users (username, email, country) VALUES
('tehila_r', 'tehila@gmail.com', 'Israel'),
('john_doe', 'john@gmail.com', 'USA'),
('maria_g', 'maria@gmail.com', 'Spain'),
('yossi_k', 'yossi@gmail.com', 'Israel'),
('sara_m', 'sara@gmail.com', 'UK');

INSERT INTO playlists (name, user_id, is_public) VALUES
('My Favorites', 1, true),
('Workout Mix', 2, true),
('Chill Vibes', 3, false),
('Israeli Hits', 4, true),
('Morning Mood', 1, true);

INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES
(1, 1, 1), (1, 6, 2), (1, 8, 3),
(2, 1, 1), (2, 3, 2), (2, 9, 3),
(3, 6, 1), (3, 7, 2), (3, 2, 3),
(4, 5, 1), (4, 3, 2),
(5, 8, 1), (5, 6, 2), (5, 10, 3);

INSERT INTO plays (user_id, song_id, played_at, duration_played) VALUES
(1, 8, NOW() - INTERVAL '1 day', 200),
(1, 6, NOW() - INTERVAL '2 days', 295),
(1, 10, NOW() - INTERVAL '2 days', 200),
(2, 3, NOW() - INTERVAL '3 days', 198),
(2, 1, NOW() - INTERVAL '1 day', 219),
(3, 7, NOW() - INTERVAL '5 days', 228),
(3, 6, NOW() - INTERVAL '4 days', 295),
(4, 5, NOW() - INTERVAL '1 day', 204),
(4, 3, NOW() - INTERVAL '2 days', 198),
(5, 8, NOW() - INTERVAL '3 days', 200),
(5, 9, NOW() - INTERVAL '1 day', 230),
(1, 3, NOW() - INTERVAL '6 days', 198),
(2, 8, NOW() - INTERVAL '2 days', 200);