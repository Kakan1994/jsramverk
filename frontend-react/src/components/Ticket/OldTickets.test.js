import React from 'react';
import { render, screen } from '@testing-library/react';
import OldTickets from './OldTickets';

describe('<OldTickets />', () => {
    it('should render old tickets', () => {

        const mockOldTickets = [
            {
                code: "6789",
                trainnumber: "123",
                traindate: "2023-01-01",
                id: 1
            }
        ];

        render(<OldTickets oldTickets={mockOldTickets}/>);

        expect(screen.getByText(/6789/)).toBeInTheDocument();
    });

    it('should return early if no old tickets', () => {
        const mockOldTickets = null;

        render(<OldTickets oldTickets={mockOldTickets}/>);

        expect(screen.getByText("Loading tickets...")).toBeInTheDocument();
    });
});