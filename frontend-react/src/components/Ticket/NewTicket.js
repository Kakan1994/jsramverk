import { useState, useEffect } from "react";

import Delay from "../Delayed/Delay";

const API_URL = process.env.NODE_ENV !== 'production'
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

function LocationString({trainData}) {
    return (
        <>
            {trainData.FromLocation &&
                <h3>Trains from {trainData.FromLocation[0].LocationName} to {trainData.ToLocation[0].LocationName}. Right now in {trainData.LocationSignature}.</h3>
            }
        </>
    )
}

function NewTicketForm({ onAddNewTicket }) {
    const [reasonCode, setReasonCode] = useState('');
    const [reasonCodes, setReasonCodes] = useState(null);

    useEffect(() => {
        const fetchReasonCodes = async () => {
            try {
                const response = await fetch(`${API_URL}/codes`);
                const result = await response.json();
                setReasonCodes(result.data);
                setReasonCode(result.data[0].Code);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchReasonCodes();
    }, []);

    if (!reasonCodes) return "Loading reason codes...";

    const handleSubmit = async (event) => {
        event.preventDefault();
        onAddNewTicket(reasonCode);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="reasonCode">Reason for delay:</label>
            <select id="reasonCode"
                value={reasonCode}
                onChange={(event) => setReasonCode(event.target.value)}
            >
                {reasonCodes.map((code, index) => (
                    <option key={index} value={code.Code}>
                        {code.Code} - {code.Level3Description}
                    </option>
                ))}
            </select><br /><br />
            <input type="submit" value="Add ticket" /><br /><br />
        </form>
    )
}

function NewTicket({invokeMock, trainData, onAddNewTicket}) {
    return (
        <div>
            <h1>New ticket</h1>
            <LocationString trainData={trainData} />
            <div><strong>Delayed:</strong> <Delay train={trainData}/></div>
            <NewTicketForm trainData={trainData} onAddNewTicket={onAddNewTicket} />
        </div>
    )
}

export default NewTicket;
