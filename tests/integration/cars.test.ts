import request from 'supertest';
import { app } from '../../src/app.js';

describe('GET /cars', () => {
    const endpoint = '/api/cars';
    it('returns all cars', async () => {
        const response = await request(app)
            .get(endpoint)
            .set('x-api-key', 'blablabla');
        expect(response.status).toBe(200);
    });

    // Remember you can run tests together so you could create a car, check that they exist and the body is correct, delete the car, check that you can’t find them again.
    // i think body is checked by validation unit.
    var createdCarID: any = undefined;
    var createdCarBody: any = undefined;
    it('creates a valid car', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                make: 'Integration Car',
                model: 'Something',
            })
            .set('x-api-key', 'blablabla');

        expect(response.status).toBe(201);

        createdCarID = response.body._id;
        createdCarBody = response.body;
        expect(createdCarID).toBeDefined();
    });

    it('checks the new car exists', async () => {
        const response = await request(app)
            .get(`${endpoint}/${createdCarID}`)
            .set('x-api-key', 'blablabla');

        expect(response.status).toBe(200);
    });

    it('deletes valid car', async () => {
        const response = await request(app)
            .delete(`${endpoint}/${createdCarID}`)
            .set('x-api-key', 'blablabla');

        expect(response.status).toBe(200);
        // expect(createdCarID).toBeUndefined();
        // better check that you can't find the object again
    });

    it('checks the car DOESNT exist anymore', async () => {
        const response = await request(app)
            .get(`${endpoint}/${createdCarID}`)
            .set('x-api-key', 'blablabla');

        expect(response.status).toBe(404);
    });
});
