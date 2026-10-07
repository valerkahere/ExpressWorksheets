import request from 'supertest';
import { app } from '../../src/app.js';
import { connectDB } from '../../src/config/database.js';

beforeAll(async () => {
  await connectDB();
});

describe('GET /cars', () => {
  it('returns all cars', async () => {
    const response = await request(app)
    .get('/api/cars')
    .set('x-api-key', 'blablabla');
    expect(response.status).toBe(200);
  });
});
