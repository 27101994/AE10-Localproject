import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore, EVENT_TYPES } from '@store/eventStore';
import { useLiveStore } from '@store/liveStore';
import EventCard from '@components/EventCard';
import Button from '@components/Button';

export default function StartEvent() {
    const navigate = useNavigate();
    const { setEvent, setEventMode } = useEventStore();
    const { startSession } = useLiveStore();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedMode, setSelectedMode] = useState('sighter');

    const handleStart = () => {
        if (!selectedEvent) {
            alert('Please select an event type');
            return;
        }

        // Set event in store
        setEvent(selectedEvent);
        setEventMode(selectedMode);

        // Get event details
        const event = EVENT_TYPES.find(e => e.id === selectedEvent);

        // Start live session
        startSession(event.name, selectedMode);

        // Navigate to live page
        navigate('/live');
    };

    const handleAbort = () => {
        setSelectedEvent(null);
        setSelectedMode('sighter');
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Start New Event</h1>
                <p className="text-gray-400">Select your event type and mode to begin</p>
            </div>

            {/* Event Type Selection */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Event Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {EVENT_TYPES.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            selected={selectedEvent}
                            onSelect={setSelectedEvent}
                        />
                    ))}
                </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Mode</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        onClick={() => setSelectedMode('sighter')}
                        className={`card cursor-pointer transition-all duration-300 ${selectedMode === 'sighter'
                                ? 'border-primary-500 bg-dark-elevated'
                                : 'border-dark-border hover:border-primary-500/50'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-100">Sighter Mode</h3>
                            {selectedMode === 'sighter' && (
                                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-400">
                            Practice shots before the match. Grey triangle indicator will be shown.
                        </p>
                    </div>

                    <div
                        onClick={() => setSelectedMode('match')}
                        className={`card cursor-pointer transition-all duration-300 ${selectedMode === 'match'
                                ? 'border-primary-500 bg-dark-elevated'
                                : 'border-dark-border hover:border-primary-500/50'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-100">Match Mode</h3>
                            {selectedMode === 'match' && (
                                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-400">
                            Official match shots that count towards your score.
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <Button
                    variant="success"
                    size="lg"
                    onClick={handleStart}
                    disabled={!selectedEvent}
                    className="flex-1"
                >
                    🎯 Start Event
                </Button>

                <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleAbort}
                    className="flex-1"
                >
                    ↺ Reset Selection
                </Button>
            </div>
        </div>
    );
}
