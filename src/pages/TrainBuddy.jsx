import React, { useState, useEffect, useMemo } from 'react';
import { useBuddyStore } from '@store/buddyStore';
import Button from '@components/Button';
import PlayerTile from '@components/PlayerTile';
import DataTable from '@components/DataTable';
import Modal from '@components/Modal';
import { calculateGroupRadius, calculateGroupCenter, generateDummyShot } from '@utils/shootingUtils';
import { FaBullseye, FaLink, FaHourglassHalf, FaTrophy, FaUsers, FaListOl } from 'react-icons/fa';

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

    const [viewMode, setViewMode] = useState('buddies'); // 'buddies' or 'leaderboard'

    // Calculate stats for each participant
    const participantsWithStats = useMemo(() => participants.map(p => ({
        ...p,
        totalScore: p.shots ? p.shots.reduce((acc, s) => acc + s.score, 0) : 0,
        groupRadius: p.shots ? calculateGroupRadius(p.shots) : 0,
        groupCenter: p.shots ? calculateGroupCenter(p.shots) : { x: 0, y: 0 },
    })), [participants]);

    // Separate Current User (Host/Self) - assuming first or identified by ID (using first for now as Host/Self)
    // In a real app, match with useAuthStore user.id
    const currentUser = participantsWithStats.length > 0 ? participantsWithStats[0] : null;
    const otherParticipants = participantsWithStats.length > 0 ? participantsWithStats.slice(1) : [];

    // Leaderboard Data
    const leaderboardData = useMemo(() => {
        return [...participantsWithStats]
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((p, index) => ({
                rank: index + 1,
                name: p.name,
                shots: p.shots?.length || 0,
                time: p.startTime ? new Date(Date.now() - p.startTime).toISOString().substr(14, 5) : '00:00', // Mock time duration
                score: p.totalScore,
            }));
    }, [participantsWithStats]);

    const leaderboardColumns = [
        { header: 'Pos', key: 'rank', align: 'center' },
        { header: 'Name', key: 'name', align: 'left' },
        { header: 'Shots', key: 'shots', align: 'center' },
        { header: 'Time', key: 'time', align: 'center' },
        { header: 'Score', key: 'score', align: 'right' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-text mb-2">Train with Buddy</h1>
                <p className="text-dark-muted">Create or join a training session with friends</p>
            </div>

            {!roomCode ? (
                /* No Room - Show Create/Join Options */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-8 rounded-2xl text-center py-12">
                        <div className="text-6xl mb-4 flex justify-center text-primary-500"><FaBullseye /></div>
                        <h2 className="text-2xl font-bold text-dark-text mb-3">Create Match</h2>
                        <p className="text-dark-muted mb-6">
                            Start a new training session and invite others to join
                        </p>
                        <Button variant="success" size="lg" onClick={handleCreateRoom}>
                            Create New Match
                        </Button>
                    </div>

                    <div className="glass-card p-8 rounded-2xl text-center py-12">
                        <div className="text-6xl mb-4 flex justify-center text-primary-500"><FaLink /></div>
                        <h2 className="text-2xl font-bold text-dark-text mb-3">Join Match</h2>
                        <p className="text-dark-muted mb-6">
                            Enter a code to join an existing training session
                        </p>
                        <Button variant="primary" size="lg" onClick={() => setShowJoinModal(true)}>
                            Join with Code
                        </Button>
                    </div>
                </div>
            ) : (

                /* In Room - New Layout */
                <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">

                    {/* LEFT: User Focus View (Larger) */}
                    <div className="flex-[2] flex flex-col min-h-0">
                        <div className="glass-panel p-4 mb-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-dark-text flex items-center gap-2">
                                <FaBullseye className="text-primary-500" /> Your Live Target
                            </h2>
                            <div className="text-sm text-dark-muted">
                                Room: <span className="font-mono text-primary-500 font-bold ml-1">{roomCode}</span>
                            </div>
                        </div>

                        <div className="flex-1 glass-panel p-2 rounded-2xl overflow-hidden relative">
                            {currentUser ? (
                                <PlayerTile player={currentUser} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-dark-muted">
                                    <FaHourglassHalf className="text-4xl mb-4 opacity-50" />
                                    <p>Waiting for session to start...</p>
                                </div>
                            )}
                        </div>
                        {/* Action Footer for User */}
                        <div className="mt-4 flex justify-end">
                            <Button variant="secondary" size="sm" onClick={handleLeaveRoom}>
                                Leave Room
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT: Sidebar (Buddies / Leaderboard) */}
                    <div className="flex-1 flex flex-col min-h-0 glass-panel rounded-2xl p-0 overflow-hidden border border-dark-border">
                        {/* Sidebar Header with Toggle */}
                        <div className="p-4 border-b border-dark-border bg-black/20 flex justify-between items-center">
                            <div className="font-bold text-dark-text flex items-center gap-2">
                                {viewMode === 'buddies' ? <FaUsers /> : <FaTrophy className="text-yellow-500" />}
                                {viewMode === 'buddies' ? 'Participants' : 'Leaderboard'}
                            </div>
                            <div className="flex bg-dark-bg rounded-lg p-1 border border-dark-border">
                                <button
                                    onClick={() => setViewMode('buddies')}
                                    className={`p-2 rounded ${viewMode === 'buddies' ? 'bg-primary-500 text-white shadow-lg' : 'text-dark-muted hover:text-white'} transition-all`}
                                    title="View Buddies"
                                >
                                    <FaUsers />
                                </button>
                                <button
                                    onClick={() => setViewMode('leaderboard')}
                                    className={`p-2 rounded ${viewMode === 'leaderboard' ? 'bg-primary-500 text-white shadow-lg' : 'text-dark-muted hover:text-white'} transition-all`}
                                    title="View Leaderboard"
                                >
                                    <FaListOl />
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {viewMode === 'buddies' ? (
                                <div className="space-y-4">
                                    {otherParticipants.length === 0 ? (
                                        <div className="text-center py-10 text-dark-muted">
                                            <p>No other participants yet.</p>
                                        </div>
                                    ) : (
                                        otherParticipants.map((participant) => (
                                            <div key={participant.id} className="h-64">
                                                <PlayerTile player={participant} compact={true} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="h-full">
                                    <DataTable
                                        columns={leaderboardColumns}
                                        data={leaderboardData}
                                        className="h-full border-none shadow-none bg-transparent"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }

            {/* Join Modal */}
            <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Training Session">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-2">
                            Enter Room Code
                        </label>
                        <input
                            type="text"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            className="glass-input w-full text-center text-2xl tracking-widest font-mono"
                            placeholder="ABC123"
                            maxLength={6}
                        />
                    </div>
                    <Button onClick={handleJoinRoom} className="w-full">
                        Join Match
                    </Button>
                </div>
            </Modal>
        </div >
    );
}
