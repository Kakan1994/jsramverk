import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Delayed/DelayedTrains', () => {
  return function DummyDelayedTrains() {
    return <div>DelayedTrains dummy</div>;
  };
});

jest.mock('./components/Map/TrainMap', () => {
  return function DummyTrainMap() {
    return <div>TrainMap dummy</div>;
  };
});

describe('App', () => {
  it('renders DelayedTrains component', () => {
    render(<App />);
    expect(screen.getByText('DelayedTrains dummy')).toBeInTheDocument();
  });

  it('renders map placeholder', () => {
    render(<App />);
    expect(screen.getByText('TrainMap dummy')).toBeInTheDocument();
  });
});
