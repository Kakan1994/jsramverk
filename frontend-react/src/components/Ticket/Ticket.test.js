import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import * as React from 'react';
import Ticket from './Ticket';

let mockNewTicketProps;

jest.mock('./NewTicket', () => {
  return function MockedNewTicket(props) {
    mockNewTicketProps = props;
    if (props.invokeMock) {
      props.onAddNewTicket('ABC');
    }
    return <div>NewTicket Mock</div>;
  };
});


jest.mock('./OldTickets', () => {
  return function MockedOldTickets() {
    return <div>OldTickets Mock</div>;
  };
});

describe('<Ticket />', () => {
  beforeEach(() => {
      global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });
  

  it('fetches old tickets', async () => {
    const mockOldTickets = [
      {
        code: "6789",
        trainnumber: "123",
        traindate: "2023-01-01",
        id: 1
      }
    ];

    global.fetch.mockResolvedValueOnce({ 
      json: jest.fn().mockResolvedValue({ data: mockOldTickets }) 
    });

    jest.spyOn(React, 'createElement').mockImplementation((type, props) => {
      // eslint-disable-next-line no-undef
      if (type === MockedNewTicket) {
          mockNewTicketProps = props;
      }
      return jest.requireActual('react').createElement(type, props);
    });

    render(<Ticket isOpen={true} onClose={jest.fn()} trainData={{}} />);

    await waitFor(() => {
      expect(screen.getByText("OldTickets Mock")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("NewTicket Mock")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:1337/tickets');
    });
  });

  it("test fetch error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Mock fetch error"));

    console.error = jest.fn();

    render(<Ticket isOpen={true} onClose={jest.fn()} trainData={{}} />);

    await waitFor(() => expect(console.error).toHaveBeenCalledTimes(1));

    expect(console.error).toHaveBeenCalledWith("Error:", new Error("Mock fetch error"));
  });

  it('closes ticket view', async () => {
    const mockOldTickets = [
      {
        code: "6789",
        trainnumber: "123",
        traindate: "2023-01-01",
        id: 1
      }
    ];

    global.fetch.mockResolvedValueOnce({ 
      json: jest.fn().mockResolvedValue({ data: mockOldTickets }) 
    });

    const mockOnClose = jest.fn();

    render(<Ticket isOpen={true} onClose={mockOnClose} trainData={{}} />);

    await waitFor(() => {
      expect(screen.getByText("Close")).toBeInTheDocument();
    });


    fireEvent.click(screen.getByText("Close"));


    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should add a new ticket and refetch old tickets', async () => {
    const mockTrainData = {
      OperationalTrainNumber: "12345",
      EstimatedTimeAtLocation: "2023-01-02T03:04:05"
    };

    const mockOldTickets = [
      {
        code: "6789",
        trainnumber: "123",
        traindate: "2023-01-01",
        id: 1
      }
    ];

    global.fetch
      .mockResolvedValueOnce({ 
        json: jest.fn().mockResolvedValue({ data: mockOldTickets }) 
      })
      .mockResolvedValueOnce({ ok: true })


    const mockOnClose = jest.fn();

    render(<Ticket invokeMock={true} isOpen={true} onClose={mockOnClose} trainData={mockTrainData} />);

    await waitFor(() => {
      expect(screen.getByText("NewTicket Mock")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:1337/tickets',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            code: "ABC",
            trainnumber: mockTrainData.OperationalTrainNumber,
            traindate: mockTrainData.EstimatedTimeAtLocation.substring(0, 10)
          })
        })
      );
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:1337/tickets');
    });
  });
  
  it('should handle error when adding a new ticket', async () => {
    const mockTrainData = {
      OperationalTrainNumber: "12345",
      EstimatedTimeAtLocation: "2023-01-02T03:04:05"
    };
  
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: [] })
    });
    
    global.fetch.mockRejectedValueOnce(new Error("Mock fetch error"));
  
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const mockOnClose = jest.fn();
  
    render(<Ticket invokeMock={true} isOpen={true} onClose={mockOnClose} trainData={mockTrainData} />);
  
    await waitFor(() => {
      expect(screen.getByText("NewTicket Mock")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', new Error("Mock fetch error"));
    });

    consoleErrorSpy.mockRestore();
  });
});
