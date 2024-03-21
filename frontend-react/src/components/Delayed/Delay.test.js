import React from 'react';
import { render, screen } from '@testing-library/react';
import Delay from './Delay';

describe('<Delay />', () => {
  it('calculates positive delay', () => {
    const train = {
        AdvertisedTimeAtLocation: '2023-09-06T12:00:00Z',
        EstimatedTimeAtLocation: '2023-09-06T12:10:00Z',
    };

    render(<Delay train={train} />);
    expect(screen.getByText('10 minutes')).toBeInTheDocument();
  });

  it('shows zero delay', () => {
      const train = {
        AdvertisedTimeAtLocation: '2023-09-06T12:00:00Z',
        EstimatedTimeAtLocation: '2023-09-06T12:00:00Z',
      };

      render(<Delay train={train} />);
      expect(screen.getByText('0 minutes')).toBeInTheDocument();
  });
});
