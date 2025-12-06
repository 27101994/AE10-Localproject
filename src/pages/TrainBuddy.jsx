import React, { useState, useEffect } from 'react';
import { useBuddyStore } from '@store/buddyStore';
import Button from '@components/Button';
import PlayerTile from '@components/PlayerTile';
import Modal from '@components/Modal';
import { calculateGroupRadius, calculateGroupCenter, generateDummyShot } from '@utils/shootingUtils';

export default function TrainBuddy() {
    const { roomCode, isHost, participants, createRoom, joinRoom, addParticipant, updateParticipant, leaveRoom } = useBuddyStore();
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');

    // Mock participant data for demonstration
    useEffect(() => {
        if (isHost && participants.length === 0) {
            // Add mock participants
            addParticipant({
                id: 1,
                name: 'John Doe',
                shots: [generateDummyShot(1), generateDummyShot(2), generateDummyShot(3)],
                currentShot: 3,
                startTime: Date.now() - 180000,
                isActive: true,
            });

            setTimeout(() => {
                addParticipant({
                    id: 2,
                    name: 'Jane Smith',
                    shots: [generateDummyShot(1), generateDummyShot(2)],
                    currentShot: 2,
                    startTime: Date.now() - 120000,
                    isActive: true,
                });
            }, 1000);
        }
    }, [isHost]);

    const handleCreateRoom = () => {
        const code = createRoom();
        alert(`Room created! Share this code: ${code}`);
    };

    const handleJoinRoom = () => {
        if (joinCode.length === 6) {
            joinRoom(joinCode);
            setShowJoinModal(false);
            setJoinCode('');
        } else {
            alert('Please enter a valid 6-character code');
        }
    };

    const handleLeaveRoom = () => {
        if (window.confirm('Are you sure you want to leave this room?')) {
            leaveRoom();
        }
    };

    // Calculate stats for each participant
    const participantsWithStats = participants.map(p => ({
        ...p,
        groupRadius: p.shots ? calculateGroupRadius(p.shots) : 0,
        groupCenter: p.shots ? calculateGroupCenter(p.shots) : { x: 0, y: 0 },
    }));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Train with Buddy</h1>
                <p className="text-gray-400">Create or join a training session with friends</p>
            </div>

            {!roomCode ? (
                /* No Room - Show Create/Join Options */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-elevated text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h2 className="text-2xl font-bold text-gray-100 mb-3">Create Match</h2>
                        <p className="text-gray-400 mb-6">
                            Start a new training session and invite others to join
                        </p>
                        <Button variant="success" size="lg" onClick={handleCreateRoom}>
                            Create New Match
                        </Button>
                    </div>

                    <div className="card-elevated text-center py-12">
                        <div className="text-6xl mb-4">🔗</div>
                        <h2 className="text-2xl font-bold text-gray-100 mb-3">Join Match</h2>
                        <p className="text-gray-400 mb-6">
                            Enter a code to join an existing training session
                        </p>
                        <Button variant="primary" size="lg" onClick={() => setShowJoinModal(true)}>
                            Join with Code
                        </Button>
                    </div>
                </div>
            ) : (
                /* In Room - Show Participants */
                <div>
                    {/* Room Info Header */}
                    <div className="card mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-100 mb-1">
                                    {isHost ? 'Your Match' : 'Training Session'}
                                </h2>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span>Room Code: <span className="font-mono text-primary-400 text-lg">{roomCode}</span></span>
                                    <span>•</span>
                                    <span>{participants.length} Participant{participants.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <Button variant="secondary" onClick={handleLeaveRoom}>
                                Leave Room
                            </Button>
                        </div>
                    </div>

                    {/* Participants Grid */}
                    {participantsWithStats.length === 0 ? (
                        <div className="card text-center py-16">
                            <div className="text-6xl mb-4">⏳</div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">Waiting for participants...</h3>
                            <p className="text-gray-500">Share the room code for others to join</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {participantsWithStats.map((participant) => (
                                <PlayerTile key={participant.id} player={participant} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Join Modal */}
            <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Training Session">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Enter Room Code
                        </label>
                        <input
                            type="text"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            className="input w-full text-center text-2xl tracking-widest font-mono"
                            placeholder="ABC123"
                            maxLength={6}
                        />
                    </div>
                    <Button onClick={handleJoinRoom} className="w-full">
                        Join Match
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
