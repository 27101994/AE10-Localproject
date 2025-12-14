import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore, EVENT_TYPES } from '@store/eventStore';
import { useLiveStore } from '@store/liveStore';
import EventCard from '@components/EventCard';
import Button from '@components/Button';
import { FaBullseye } from 'react-icons/fa';

export default function StartEvent() {
    const navigate = useNavigate();
    const { setEvent, setEventMode } = useEventStore();
    const { startSession } = useLiveStore();

    const [selectedEventId, setSelectedEventId] = useState(null);

    const pistolEvents = EVENT_TYPES.filter(e => e.type === 'pistol');
    const rifleEvents = EVENT_TYPES.filter(e => e.type === 'rifle');

    const handleStart = () => {
        if (!selectedEventId) {
            alert('Please select an event type');
            return;
        }

        const event = EVENT_TYPES.find(e => e.id === selectedEventId);

        // Set event in store
        setEvent(selectedEventId);
        // Default to sighter mode as manual selection is removed
        setEventMode('sighter');

        // Start live session
        startSession(event.name, 'sighter');

        // Navigate to live page
        navigate('/live');
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-text mb-2">Start New Event</h1>
                <p className="text-dark-muted">Select your event to begin</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Pistol Events Section */}
                <div>
                    <h2 className="text-2xl font-bold text-accent-cyan mb-6 pb-2 border-b border-dark-border flex items-center">
                        Pistol Events
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {pistolEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                selected={selectedEventId}
                                onSelect={setSelectedEventId}
                            />
                        ))}
                    </div>
                </div>

                {/* Rifle Events Section */}
                <div>
                    <h2 className="text-2xl font-bold text-accent-purple mb-6 pb-2 border-b border-dark-border flex items-center">
                        Rifle Events
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {rifleEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                selected={selectedEventId}
                                onSelect={setSelectedEventId}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Start Button */}
            <div className="mt-12 flex justify-center pb-10">
                <Button
                    variant="success"
                    size="lg"
                    onClick={handleStart}
                    disabled={!selectedEventId}
                    className="w-full max-w-md text-xl py-4 shadow-lg shadow-green-500/20 transform hover:scale-105 transition-all"
                >
                    <span className="flex items-center justify-center font-bold tracking-wide">
                        <FaBullseye className="mr-3" /> START EVENT
                    </span>
                </Button>
            </div>
        </div>
    );
}
