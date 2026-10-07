import request from 'supertest';
import { app } from '../../src/app.js';


describe('GET /cars', () => {
  it('returns all cars', async () => {
    const response = await request(app)
    .get('/api/cars')
    .set('x-api-key', 'blablabla');
    expect(response.status).toBe(200);
  });
});
