import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';

describe('User Registration', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  test('Should register new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test1234'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });
});