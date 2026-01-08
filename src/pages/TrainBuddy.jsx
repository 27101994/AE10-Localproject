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

                /* In Room - Enhanced Layout */
                <div className="space-y-6">
                    {/* Room Code Header */}
                    <div className="glass-panel p-4 flex justify-between items-center rounded-2xl border border-dark-border">
                        <h2 className="text-xl font-bold text-dark-text flex items-center gap-2">
                            <FaBullseye className="text-primary-500" /> Train with Buddy
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-dark-muted">
                                Room Code: <span className="font-mono text-primary-500 font-bold ml-1 text-lg">{roomCode}</span>
                            </div>
                            <Button variant="secondary" size="sm" onClick={handleLeaveRoom}>
                                Leave Room
                            </Button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex gap-6 h-[calc(100vh-280px)] min-h-[500px]">

                        {/* LEFT: User's Large Live View + Other Buddies (Hidden in Leaderboard Mode) */}
                        <div className={`${viewMode === 'leaderboard' ? 'flex-[3]' : 'flex-[5]'} flex flex-col gap-4 transition-all duration-300`}>
                            {/* User's Main Live View */}
                            <div className="flex-1 glass-panel p-4 rounded-2xl border border-dark-border overflow-hidden">
                                <div className="mb-3 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        Your Live Target
                                    </h3>
                                    {currentUser && (
                                        <div className="flex gap-4 text-sm">
                                            <div className="text-dark-muted">
                                                Shots: <span className="text-primary-500 font-bold">{currentUser.shots?.length || 0}</span>
                                            </div>
                                            <div className="text-dark-muted">
                                                Score: <span className="text-accent-green font-bold">{currentUser.totalScore}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="h-[calc(100%-3rem)] bg-dark-bg/30 rounded-xl overflow-hidden">
                                    {currentUser ? (
                                        <PlayerTile player={currentUser} />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-dark-muted">
                                            <FaHourglassHalf className="text-4xl mb-4 opacity-50 animate-pulse" />
                                            <p>Waiting for session to start...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Other Buddies - Small Thumbnails (Hidden when viewing leaderboard) */}
                            {viewMode === 'buddies' && otherParticipants.length > 0 && (
                                <div className="h-48 glass-panel p-3 rounded-2xl border border-dark-border">
                                    <h3 className="text-sm font-bold text-dark-muted mb-2 uppercase tracking-wider flex items-center gap-2">
                                        <FaUsers className="text-primary-500" />
                                        Other Participants ({otherParticipants.length})
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3 h-[calc(100%-2rem)]">
                                        {otherParticipants.slice(0, 3).map((participant) => (
                                            <div key={participant.id} className="bg-dark-bg/30 rounded-lg overflow-hidden border border-dark-border hover:border-primary-500 transition-all">
                                                <PlayerTile player={participant} compact={true} />
                                            </div>
                                        ))}
                                        {otherParticipants.length > 3 && (
                                            <div className="bg-dark-bg/50 rounded-lg flex items-center justify-center text-dark-muted border border-dark-border">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold">+{otherParticipants.length - 3}</div>
                                                    <div className="text-xs">more</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Leaderboard Panel (Always Visible) */}
                        <div className={`${viewMode === 'leaderboard' ? 'flex-[2]' : 'flex-[2]'} glass-panel rounded-2xl border border-dark-border overflow-hidden flex flex-col transition-all duration-300`}>
                            {/* Leaderboard Header */}
                            <div className="p-4 border-b border-dark-border bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
                                        <FaTrophy className="text-yellow-500" />
                                        Leaderboard
                                    </h3>
                                    <button
                                        onClick={() => setViewMode(viewMode === 'leaderboard' ? 'buddies' : 'leaderboard')}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${viewMode === 'leaderboard'
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                : 'bg-dark-bg text-dark-muted hover:text-white hover:bg-dark-elevated border border-dark-border'
                                            }`}
                                    >
                                        {viewMode === 'leaderboard' ? (
                                            <span className="flex items-center gap-2">
                                                <FaUsers /> Show Buddies
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <FaTrophy /> Focus Mode
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-dark-muted">
                                    {viewMode === 'leaderboard'
                                        ? 'Focus view: Your target + rankings'
                                        : 'Click Focus Mode to hide buddy views'}
                                </p>
                            </div>

                            {/* Leaderboard Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                                <DataTable
                                    columns={leaderboardColumns}
                                    data={leaderboardData}
                                    className="border-none shadow-none bg-transparent"
                                />
                            </div>
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
