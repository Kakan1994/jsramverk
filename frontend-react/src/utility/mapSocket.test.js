// frontend-react/src/utility/mapSocket.test.js
import mapSocket from './mapSocket';
import io from "socket.io-client";
import L, { marker } from 'leaflet';

jest.mock('socket.io-client');
jest.mock('leaflet');

describe('mapSocket', () => {
    let map, markersRef, socketDummy;
    let messageCallback;

    beforeEach(() => {
        socketDummy = {
            on: jest.fn(),
            disconnect: jest.fn()
        };
        io.mockReturnValue(socketDummy);

        L.marker = jest.fn().mockReturnValue({
            bindPopup: jest.fn().mockReturnValue({
                addTo: jest.fn()
            })
        });

        map = { removeLayer: jest.fn() };
        markersRef = { current: {} };

        mapSocket(map, markersRef);
        messageCallback = socketDummy.on.mock.calls.find(call => call[0] === 'message')[1];
    });

    it('connects to the socket', () => {
        expect(io).toHaveBeenCalledWith('http://localhost:1337');
    });

    it('listens to "message" events on the socket', () => {
        expect(socketDummy.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('updates the marker if trainnumber exists', () => {
        const dummyMarker = { setLatLng: jest.fn() };
        markersRef.current = { '123': dummyMarker };
        const dummyData = { trainnumber: '123', position: [0, 0] };

        messageCallback(dummyData);

        expect(dummyMarker.setLatLng).toHaveBeenCalledWith(dummyData.position);
        expect(L.marker).not.toHaveBeenCalled();
    });

    it('creates a new marker if trainnumber does not exist', () => {
        markersRef.current = {};
        const dummyData = { trainnumber: '123', position: [0, 0] };

        messageCallback(dummyData);

        expect(L.marker).toHaveBeenCalledWith(dummyData.position);
        expect(L.marker().bindPopup).toHaveBeenCalledWith(dummyData.trainnumber);
        expect(L.marker().bindPopup().addTo).toHaveBeenCalledWith(map);
    });

    it('removes all markers from the map and disconnects the socket', () => {
        const returnedFunction = mapSocket(map, markersRef);
        markersRef.current = {
            key1: "marker1",
            key2: "marker2",
            key3: "marker3"
        };

        returnedFunction();

        Object.values(markersRef.current).forEach((marker) => {
            expect(map.removeLayer).toHaveBeenCalledWith(marker);
        });

        expect(socketDummy.disconnect).toHaveBeenCalledTimes(1);
    });
});
