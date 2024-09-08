const request = require('supertest');
const app = require('./../src/App'); // Adjust the path to your app file
const User = require('./../Models/User'); // Adjust the path to your User model
import bcrypt from 'bcryptjs';

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
      
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('user');
  });

  it('should login a user', async () => {
    await User.create({
      email: 'loginuser@example.com',
      password: await bcrypt.hash('password123', 10),
    });

    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'loginuser@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
