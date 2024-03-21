// frontend-react/src/components/Delayed/DelayedTrains.js
import { useState, useEffect } from 'react';

import styled from 'styled-components';

import Train from './Train';
import Ticket from '../Ticket/Ticket';

const API_URL = process.env.NODE_ENV !== 'production'
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

const DelayedTrainsList = styled.div`
    display: flex;
    flex-direction: column;
`;

function DelayedTrains() {
    const [delayedTrains, setDelayedTrains] = useState(null);
    const [isTicketOpen, setIsTicketOpen] = useState(false);
    const [currentTrain, setCurrentTrain] = useState(null);

    const handleTrainClick = (trainData) => {
        setCurrentTrain(trainData);
        setIsTicketOpen(true);
    };

    const handleCloseTicket = () => {
        setIsTicketOpen(false);
        setCurrentTrain(null);
    };

    useEffect(() => {
        const fetchDelayedTrains = async () => {
            try {
                const response = await fetch(`${API_URL}/delayed`);
                const result = await response.json();
                setDelayedTrains(result.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchDelayedTrains();
    }, []);

    if (!delayedTrains) return "Loading...";

    return (
        <>
            {isTicketOpen && 
                <Ticket 
                    isOpen={isTicketOpen}
                    onClose={handleCloseTicket}
                    trainData={currentTrain}
            />}

            <h1> Delayed trains</h1>
            <DelayedTrainsList>
                {delayedTrains.map((train, index) => (
                    <Train
                        key={index}
                        train={train}
                        onClick={() => handleTrainClick(train)}
                    />
                ))}
            </DelayedTrainsList>
        </>
    );
}

export default DelayedTrains;
