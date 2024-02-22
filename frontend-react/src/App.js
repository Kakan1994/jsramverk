// frontend-react/src/App.js
import React, { useState } from 'react';
import DelayedTrains from './components/DelayedTrains';
import TicketForm from './components/TicketForm';
import TrainMap from './components/TrainMap';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState('trains');
    const [selectedTrain, setSelectedTrain] = useState(null);

    const showTicketForm = (train) => {
        setSelectedTrain(train);
        setCurrentView('ticket');
    };

    return (
        <div className="App">
            {currentView === 'trains' ? (
              <>
                <DelayedTrains onTrainSelect={showTicketForm} />
                <TrainMap />
              </>
            ) : (
                <TicketForm train={selectedTrain} onBack={() => setCurrentView('trains')} />
            )}
        </div>
    );
}

export default App;
