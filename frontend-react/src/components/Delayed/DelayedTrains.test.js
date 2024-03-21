import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import DelayedTrains from "./DelayedTrains";

global.fetch = jest.fn();


describe("<DelayedTrains />", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });
  

  it("displays delayed trains", async () => {
    const mockData = [
      { 
        OperationalTrainNumber: "12345",
        LocationSignature: "AA", 
        FromLocation: [
          { LocationName: "Start" 
        }],
        ToLocation: [
          { LocationName: "End" }
        ] 
      }
    ];
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockData }),
      })
    );

    render(<DelayedTrains />);

    await screen.findByText("Start -> End");
  });

  it("opens a ticket when a train is clicked", async () => {
    const mockData = [
      { 
        OperationalTrainNumber: "12345",
        LocationSignature: "AA", 
        FromLocation: [
          { LocationName: "Start" 
        }],
        ToLocation: [
          { LocationName: "End" }
        ] 
      }
    ];

    const mockTicketData = [
      {
        code: "6789",
        trainnumber: "123",
        traindate: "2023-01-01",
        id: 1
      }
    ];

    const mockCodesData = [
      {
        Code: "AA",
        Level1Description: "A",
        Level2Description: "B",
        Level3Description: "C"
      }
    ];

    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('/delayed')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockData }),
        });
      }

      if (url.includes('/tickets')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockTicketData }),
        });
      }

      if (url.includes('/codes')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockCodesData }),
        });
      }

    });


    render(<DelayedTrains />);

    const clickableElement = await screen.findByText("Start -> End");

    fireEvent.click(clickableElement);

    await waitFor(async () => {
      expect(screen.getByText(/6789/)).toBeInTheDocument()
    });

  });

  it("closes the ticket when 'Close' is clicked", async () => {
    const mockData = [
      { 
        OperationalTrainNumber: "12345",
        LocationSignature: "AA", 
        FromLocation: [
          { LocationName: "Start" 
        }],
        ToLocation: [
          { LocationName: "End" }
        ] 
      }
    ];

    const mockTicketData = [
      {
        code: "6789",
        trainnumber: "123",
        traindate: "2023-01-01",
        id: 1
      }
    ];

    const mockCodesData = [
      {
        Code: "AA",
        Level1Description: "A",
        Level2Description: "B",
        Level3Description: "C"
      }
    ];

    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('/delayed')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockData }),
        });
      }

      if (url.includes('/tickets')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockTicketData }),
        });
      }

      if (url.includes('/codes')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockCodesData }),
        });
      }

    });

    render(<DelayedTrains />);

    const clickableElement = await screen.findByText("Start -> End");
    fireEvent.click(clickableElement);

    await waitFor(async () => {
      expect(screen.getByText("Close")).toBeInTheDocument();
    })

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(screen.queryByText("Close")).not.toBeInTheDocument();
    });
  });

  it("test fetch error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Mock fetch error"));

    console.error = jest.fn();

    render(<DelayedTrains />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledTimes(1)
    });

    expect(console.error).toHaveBeenCalledWith("Error:", new Error("Mock fetch error"));
  });


});