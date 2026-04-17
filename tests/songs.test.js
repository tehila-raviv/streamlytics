const request = require('supertest');
const app = require('../index');
const pool = require('../src/db');

jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

describe('Songs API - Trending', () => {
  it('should return top 5 trending songs with rank', async () => {
    const mockSongs = [
      { title: 'Song A', artist: 'Artist A', play_count: 100, recent_plays: 50, trend_rank: 1 },
      { title: 'Song B', artist: 'Artist B', play_count: 80, recent_plays: 30, trend_rank: 2 }
    ];

    pool.query.mockResolvedValue({ rows: mockSongs });

    const response = await request(app).get('/songs/trending');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty('trend_rank');
    expect(response.body.data[0].title).toBe('Song A');
  });
});