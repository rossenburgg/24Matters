const supertest = require('supertest');
const app = require('../server'); // Adjust this path to where your Express app is exported
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('POST /api/auth/login', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should authenticate user with correct credentials', async () => {
    // Mock user registration or seed the in-memory database with a test user

    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    console.log('User authenticated successfully with correct credentials');
  });

  it('should reject login with incorrect email', async () => {
    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'wrongemail@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(400); // Assuming 400 for invalid login attempt
    expect(response.body).toHaveProperty('message');
    console.log('Login rejected due to incorrect email');
  });

  it('should reject login with incorrect password', async () => {
    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(400); // Assuming 400 for invalid login attempt
    expect(response.body).toHaveProperty('message');
    console.log('Login rejected due to incorrect password');
  });

  // Add more tests as needed
});