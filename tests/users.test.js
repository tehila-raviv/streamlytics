const request = require('supertest');
const app = require('../index');
const pool = require('../src/db');

jest.mock('../src/db', () => ({ query: jest.fn() }));

describe('Users API - Statistics', () => {
  it('should return complex listening stats for a user', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ user_id: 1, username: 'Tehila' }] });

    const mockStats = {
      total_plays: '150',
      unique_artists: '12',
      total_seconds_listened: '45000',
      avg_play_duration: '300',
      favorite_genre: 'Pop',
      favorite_artist: 'Taylor Swift'
    };
    pool.query.mockResolvedValueOnce({ rows: [mockStats] });

    pool.query.mockResolvedValueOnce({ rows: [{ title: 'Anti-Hero', artist: 'Taylor Swift' }] });

    const response = await request(app).get('/users/1/stats');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.stats.favorite_genre).toBe('Pop');
    expect(response.body.data.stats.total_plays).toBe('150');
  });

  it('should return 404 if user does not exist', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); 

    const response = await request(app).get('/users/999/stats');
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});