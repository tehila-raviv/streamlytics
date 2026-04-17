const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const artistsRouter = require('./src/routes/artists');
app.use('/artists', artistsRouter);
const songsRouter = require('./src/routes/songs');
app.use('/songs', songsRouter);
const usersRouter = require('./src/routes/users');
app.use('/users', usersRouter);
const playlistsRouter = require('./src/routes/playlists');
app.use('/playlists', playlistsRouter);
const playsRouter = require('./src/routes/plays');
app.use('/plays', playsRouter);
const authRouter = require('./src/routes/auth');
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Streamlytics API!' });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Streamlytics running on port ${PORT}`);
  });
}

module.exports = app;