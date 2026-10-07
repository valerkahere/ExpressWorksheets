import request from 'supertest';
import { app } from '../../src/app.js';

describe('GET /ping', () => {
  it('should return hello from expected person', async () => {
    const response = await request(app).get('/ping');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: 'hello from valerkahere',
    });
  });
});
