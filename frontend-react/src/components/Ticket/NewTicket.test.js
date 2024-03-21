import React from "react";
import { render, act, waitFor, fireEvent, screen } from "@testing-library/react";
import NewTicket from "./NewTicket";

jest.mock('../Delayed/Delay', () => {
    return function DummyDelay() {
        return <div>Dummy Delay</div>;
    };
});

describe('<NewTicket />', () => {
    afterAll(() => {
        globalThis.fetch.mockRestore();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    it('should render location string correctly', async () => {
        const dummyTrainData = { 
            OperationalTrainNumber: "12345",
            LocationSignature: "AA", 
            FromLocation: [
                { LocationName: "Start" 
            }],
            ToLocation: [
                { LocationName: "End" }
            ]
        };

        const mockOnAddNewTicket = () => {};

        const mockCodesData = [
            {
                Code: "AA",
                Level1Description: "A",
                Level2Description: "B",
                Level3Description: "C"
            }
        ];

        globalThis.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: mockCodesData })
            })
        );

        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
            render(
                <NewTicket
                    trainData={dummyTrainData}
                    onAddNewTicket={mockOnAddNewTicket}
                />
            );
        });

        await waitFor(() => {
            expect(screen.getByText('New ticket')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Trains from Start to End. Right now in AA.')).toBeInTheDocument();
        });
    });

    it('should render the reason codes dropdown correctly', async () => {
        const dummyTrainData = {
            OperationalTrainNumber: "12345",
            LocationSignature: "AA",
            FromLocation: [
                { LocationName: "Start" }
            ],
            ToLocation: [
                { LocationName: "End" }
            ]
        };

        const dummyTicketId = 1;
        const mockOnAddNewTicket = () => {};

        const dummyCodesData = [
            {
                Code: "AA",
                Level1Description: "A",
                Level2Description: "B",
                Level3Description: "C"
            }
        ];

        globalThis.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: dummyCodesData })
            })
        );

        render(
            <NewTicket
                trainData={dummyTrainData}
                newTicketId={dummyTicketId}
                onAddNewTicket={mockOnAddNewTicket}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('AA - C')).toBeInTheDocument();
        });

        const dropdown = screen.getByLabelText('Reason for delay:');
        fireEvent.change(dropdown, { target: { value: 'AA' } });

        expect(dropdown.value).toBe('AA');

        await waitFor(() => {
            expect(screen.queryByText("Loading reason codes...")).not.toBeInTheDocument();
        });
    });

    it("test fetch error", async () => {
        const dummyTrainData = {
            OperationalTrainNumber: "12345",
            LocationSignature: "AA",
            FromLocation: [
                { LocationName: "Start" }
            ],
            ToLocation: [
                { LocationName: "End" }
            ]
        };

        const dummyTicketId = 1;
        const mockOnAddNewTicket = () => {};

        global.fetch = jest.fn().mockRejectedValue(new Error("Mock fetch error"));

        console.error = jest.fn();

        render(
            <NewTicket
                trainData={dummyTrainData}
                newTicketId={dummyTicketId}
                onAddNewTicket={mockOnAddNewTicket}
            />
        );

        await waitFor(() => expect(console.error).toHaveBeenCalledTimes(1));

        expect(console.error).toHaveBeenCalledWith("Error:", new Error("Mock fetch error"));
    });

    it('should call the submit callback correctly', async () => {
        const dummyTrainData = {
            OperationalTrainNumber: "12345",
            LocationSignature: "AA",
            FromLocation: [
                { LocationName: "Start"
            }],
            ToLocation: [
                { LocationName: "End" }
            ]
        };

        const dummyTicketId = 1;
        const dummyOnAddNewTicket = jest.fn();

        const dummyCodesData = [
            {
                Code: "AA",
                Level1Description: "A",
                Level2Description: "B",
                Level3Description: "C"
            }
            ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: dummyCodesData }),
            })
        );

        render(
            <NewTicket 
                trainData={dummyTrainData}
                newTicketId={dummyTicketId}
                onAddNewTicket={dummyOnAddNewTicket}
            />
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Reason for delay:")).toBeInTheDocument()
        });

        const selectControl = screen.getByLabelText("Reason for delay:");
        fireEvent.change(selectControl, { target: { value: "AA" } });

        const submitButton = screen.getByText("Add ticket");
        fireEvent.click(submitButton);

        expect(dummyOnAddNewTicket).toHaveBeenCalledWith("AA");
    });
});