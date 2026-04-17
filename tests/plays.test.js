const request = require('supertest');
const app = require('../index');
const pool = require('../src/db');
const jwt = require('jsonwebtoken'); 

jest.mock('../src/db', () => ({ query: jest.fn() }));

describe('Plays API', () => {
  const mockToken = jwt.sign(
    { user_id: 1, username: 'tehila' }, 
    process.env.JWT_SECRET || 'test_secret'
  );

  it('should log a play and update song count', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] }); 
    pool.query.mockResolvedValueOnce({ rows: [{ song_id: 1 }] }); 
    pool.query.mockResolvedValueOnce({ rows: [{ play_id: 100 }] }); 
    pool.query.mockResolvedValueOnce({ rows: [] }); 

    const response = await request(app)
      .post('/plays')
      .set('Authorization', `Bearer ${mockToken}`) 
      .send({ user_id: 1, song_id: 1, duration_played: 200 });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Play logged successfully');
  });
});