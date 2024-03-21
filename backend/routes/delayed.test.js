const request = require('supertest');
const fetch = require('node-fetch');
const app = require('../app');

jest.mock('node-fetch');

describe('GET /delayed', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    it('should return 200 on success', async () => {
        const mockResponse = [{ TrainAnnouncement: 'Mocked train announcement' }];

        const mockResolvedData = {
            json: async () => ({ RESPONSE: { RESULT: mockResponse } })
        };

        fetch.mockResolvedValueOnce(mockResolvedData);

        const response = await request(app).get('/delayed');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('data');
    });

    it('should return 500 on failure', async () => {
        fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

        const response = await request(app).get('/delayed');
        expect(response.statusCode).toEqual(500);
    });
});
