// backend/models/trains.test.js
const fetch = require('node-fetch');

const {
    getSseurl,
    setupEventSource,
    getTrainObject,
    setupIo
} = require('./trains');

jest.mock('node-fetch');

// eslint-disable-next-line
jest.mock('eventsource', () => {
    return jest.fn().mockImplementation(() => ({
        onopen: null,
        onerror: null,
        onmessage: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        close: jest.fn()
    }));
});

describe('fecthTrainPositions', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should successfully get ssurl', async () => {
        const mockSseurl = 'mocked sseurl';
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                RESPONSE: {
                    RESULT: [{
                        INFO: {
                            SSEURL: mockSseurl
                        }
                    }]
                }
            })
        });

        const sseurl = await getSseurl();
        expect(sseurl).toBe(mockSseurl);
    });

    it('should setup EventSource correctly', () => {
        const mockSseurl = 'mocked sseurl';
        const mockEventSource = setupEventSource(mockSseurl);

        expect(mockEventSource.onopen).toBeInstanceOf(Function);
        expect(mockEventSource.onerror).toBeInstanceOf(Function);
    });

    it('should log when the connection is opened and on error', () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const mockSseurl = 'mocked sseurl';
        const mockEventSource = setupEventSource(mockSseurl);

        mockEventSource.onopen();
        expect(consoleLogSpy).toHaveBeenCalledWith('Connection to server opened.');

        mockEventSource.onerror();
        expect(consoleErrorSpy).toHaveBeenCalledWith('EventSource failed.');

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();

        if (mockEventSource && mockEventSource.removeAllListeners) {
            mockEventSource.removeAllListeners();
        }
    });

    it('should extract the correct train object from the changed position', () => {
        const mockChangedPosition = {
            Position: {
                WGS84: '45.67890,12.34567'
            },
            Train: {
                AdvertisedTrainNumber: '1234'
            },
            TimeStamp: '2024-03-19T00:18:12',
            Bearing: 90,
            Deleted: false,
            Speed: 60
        };

        const expectedTrainObject = {
            trainNumber: '1234',
            position: [12.34567, 45.67890],
            timestamp: '2024-03-19T00:18:12',
            bearing: 90,
            status: true,
            speed: 60
        };

        const result = getTrainObject(mockChangedPosition);
        expect(result).toEqual(expectedTrainObject);
    });

    it('should emit a message on train position change', () => {
        const mockSocket = {
            emit: jest.fn()
        };
        const mockIo = {
            on: jest.fn((event, callback) => callback(mockSocket))
        };
        const mockEventSource = {};

        setupIo(mockIo, mockEventSource);

        const eventData = {
            data: JSON.stringify({
                RESPONSE: {
                    RESULT: [{
                        TrainPosition: [{
                            Position: {
                                WGS84: '45.67890,12.34567'
                            },
                            Train: {
                                AdvertisedTrainNumber: '1234'
                            },
                            TimeStamp: '2024-03-19T00:18:12',
                            Bearing: 90,
                            Deleted: false,
                            Speed: 60
                        }]
                    }]
                }
            })
        };

        // call twice to make sure train positions object is not empty
        mockEventSource.onmessage(eventData);
        mockEventSource.onmessage(eventData);

        expect(mockSocket.emit).toHaveBeenCalledWith('message', expect.any(Object));
    });

    it('should catch if wrong data', () => {
        const mockSocket = {
            emit: jest.fn()
        };
        const mockIo = {
            on: jest.fn((event, callback) => callback(mockSocket))
        };
        const mockEventSource = {};
        jest.spyOn(console, 'log').mockImplementation(() => {});

        setupIo(mockIo, mockEventSource);

        const invalidEventData = {
            data: 'invalidData'
        };

        mockEventSource.onmessage(invalidEventData);

        expect(console.log).toHaveBeenCalled();

        console.log.mockRestore();
    });
});
