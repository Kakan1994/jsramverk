// backend/routes/codes.test.js
const request = require('supertest');
const fetch = require('node-fetch');
const app = require('../app');

jest.mock('node-fetch');

describe('GET /codes', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    it('should return 200 on success', async () => {
        const mockResponse = [{ ReasonCode: [{ Code: '1', Level1Description: 'Test' }] }];

        const mockResolvedData = {
            json: async () => ({ RESPONSE: { RESULT: mockResponse } })
        };

        fetch.mockResolvedValue(mockResolvedData);

        const response = await request(app).get('/codes');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('data');
    });

    it('should return 500 on failure', async () => {
        fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

        const response = await request(app).get('/codes');
        expect(response.statusCode).toEqual(500);
    });
});
