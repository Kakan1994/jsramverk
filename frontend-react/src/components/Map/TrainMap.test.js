import { render, screen } from '@testing-library/react';
import TrainMap from './TrainMap';

jest.mock('react-leaflet', () => {
    return {
        MapContainer: () => { return (<div>Dummy MapContainer</div>) },
        TileLayer: () => { return (<div>Dummy TileLayer</div>) }
    }
});

describe('TrainMap', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    it('renders the mocked MapContainer', () => {
        render(<TrainMap />);
        expect(screen.getByText('Dummy MapContainer')).toBeInTheDocument();
    });
});
