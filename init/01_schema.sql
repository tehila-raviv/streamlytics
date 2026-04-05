CREATE TABLE IF NOT EXISTS artists (
    artist_id   SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    genre       VARCHAR(50),
    country     VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS songs (
    song_id          SERIAL PRIMARY KEY,
    title            VARCHAR(100) NOT NULL,
    artist_id        INT REFERENCES artists(artist_id),
    duration_seconds INT,
    release_year     INT,
    play_count       INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
    user_id     SERIAL PRIMARY KEY,
    username    VARCHAR(50) NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE,
    country     VARCHAR(50),
    password    VARCHAR(255),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlists (
    playlist_id  SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    user_id      INT REFERENCES users(user_id),
    is_public    BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id  INT REFERENCES playlists(playlist_id),
    song_id      INT REFERENCES songs(song_id),
    position     INT,
    added_at     TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (playlist_id, song_id)
);

CREATE TABLE IF NOT EXISTS plays (
    play_id          SERIAL PRIMARY KEY,
    user_id          INT REFERENCES users(user_id),
    song_id          INT REFERENCES songs(song_id),
    played_at        TIMESTAMP DEFAULT NOW(),
    duration_played  INT
);