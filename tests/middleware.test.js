const request = require('supertest');
const app = require('../index');

describe('Auth Middleware', () => {
  it('should deny access (401) to protected routes without a token', async () => {
    const response = await request(app).post('/plays').send({});
    
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Access denied. No token provided.');
  });
});