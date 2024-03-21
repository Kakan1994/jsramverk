// backend/routes/tickets.test.js
const request = require('supertest');
const app = require('../app');
const database = require('../database');

afterAll(async () => {
    await database.closeDb();
});

describe('/tickets', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    it('GET should return 200 on success', async () => {
        const response = await request(app).get('/tickets');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('data');
    });

    it('POST should return 200 on success', async () => {
        const mockTicket = {
            code: '123',
            trainnumber: '456',
            traindate: '2024-03-18'
        };

        const response = await request(app).post('/tickets').send(mockTicket);

        expect(response.statusCode).toEqual(200);
        expect(response.body.data).toHaveProperty('_id');
        expect(response.body.data.code).toEqual('123');
    });

    it('GET should return 500 on failure', async () => {
        database.getDb = jest.fn(() => {
            throw new Error('Failed to fetch');
        });

        const response = await request(app).get('/tickets');
        expect(response.statusCode).toEqual(500);
    });

    it('POST should return 500 on failure', async () => {
        const mockTicket = {
            code: '123',
            trainnumber: '456',
            traindate: '2024-03-18'
        };

        database.getDb = jest.fn(() => {
            throw new Error('Failed to fetch');
        });

        const response = await request(app).post('/tickets').send(mockTicket);

        expect(response.statusCode).toEqual(500);
    });
});
