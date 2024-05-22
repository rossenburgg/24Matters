const request = require('supertest');
const app = require('../server'); // Ensure your server.js exports the app for testing
const User = require('../models/User');

beforeAll(async () => {
  // Optionally clear the test DB or setup test data
});

describe('User Authentication', () => {
  test('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'Password123!'
      });
    expect(response.statusCode).toBe(302); // Assuming redirection after successful registration
    console.log('Registration test passed: New user registered successfully.');
  });

  test('should login an existing user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'Password123!'
      });
    expect(response.statusCode).toBe(302); // Assuming redirection after successful login
    console.log('Login test passed: Existing user logged in successfully.');
  });
});

afterAll(async () => {
  // Optionally cleanup test data
  await User.deleteMany({ username: 'testuser' }).catch(error => {
    console.error('Error cleaning up test user data:', error.message, error.stack);
  });
  console.log('Test user data cleaned up successfully.');
});