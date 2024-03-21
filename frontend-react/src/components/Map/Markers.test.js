import { render } from '@testing-library/react';
import Markers from './Markers';
import mapSocket from '../../utility/mapSocket';

jest.mock('react-leaflet', () => ({
    useMap: jest.fn(),
}));

jest.mock('../../utility/mapSocket');

describe('<Markers />', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    it('calls mapSocket when component loads', () => {
        render(<Markers />);
        expect(mapSocket).toHaveBeenCalledTimes(1);
    });
});
