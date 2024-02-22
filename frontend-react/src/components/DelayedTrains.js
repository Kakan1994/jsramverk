// frontend-react/src/components/DelayedTrains.js
import React, { useState, useEffect } from 'react';

function DelayedTrains({ onTrainSelect }) {
    const [trains, setTrains] = useState([]);

    useEffect(() => {
        fetch("http://172.25.53.25:1337/delayed")
            .then((response) => response.json())
            .then((data) => {
                setTrains(data.data);
            });
    }, []);

    return (
        <div className="delayed-trains">
            {trains.map((train) => (
                <div key={train.OperationalTrainNumber} className='train' onClick={() => onTrainSelect(train)}>
                    <div>Train number: {train.OperationalTrainNumber}</div>
                    <div>New estimated time: {train.EstimatedTimeAtLocation}</div>
                </div>
            ))}
        </div>
    );
}

export default DelayedTrains;