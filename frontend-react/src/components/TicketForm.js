// frontend-react/src/components/TicketForm.js
import React, { useState, useEffect } from 'react';

function TicketForm({ train, onBack}) {
    const [reasonCode, setReasonCode] = useState("");
    const [reasonCodes, setReasonCodes] = useState([]);

    useEffect(() => {
        fetch("http://172.25.53.25:1337/codes")
            .then((response) => response.json())
            .then((data) => {
                setReasonCodes(data);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const newTicket = {
            code: reasonCode,
            trainnumber: train.OperationalTrainNumber,
            traindate: train.EstimatedTimeAtLocation.substring(0, 10)
        };

        fetch("http://172.25.53.25:1337/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTicket),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create ticket");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Ticket created", data);
                onBack();
            })
            .catch((error) => {
                console.error("Error creating ticket", error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="reasonCode">Reason for delay:</label>
                <select
                    id="reasonCode"
                    value={reasonCode}
                    onChange={(event) => setReasonCode(event.target.value)}>
                        {reasonCodes.map((reasonCode) => (
                            <option key={reasonCode.Code} value={reasonCode.Code}>
                                {reasonCode.description}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Submit Ticket</button>
            </form>
            <button type='button' onClick={onBack}></button>
        </div>
    );
}

export default TicketForm;
