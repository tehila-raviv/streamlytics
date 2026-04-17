const request = require('supertest');
const app = require('../index');
const pool = require('../src/db');
const bcrypt = require('bcryptjs');

jest.mock('../src/db', () => ({ query: jest.fn() }));

describe('Auth API', () => {
  it('should register a new user successfully', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); 
    pool.query.mockResolvedValueOnce({ 
      rows: [{ user_id: 1, username: 'tehila', email: 'test@test.com' }] 
    });

    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'tehila',
        email: 'test@test.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token'); 
    expect(response.body.data.username).toBe('tehila');
  });
});