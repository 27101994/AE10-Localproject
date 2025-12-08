import React, { useState, useEffect } from 'react';
import { useLiveStore } from '@store/liveStore';
import { useEventStore } from '@store/eventStore';
import TargetImage from '@components/TargetImage';
import ShotTable from '@components/ShotTable';
import Timer from '@components/Timer';
import Button from '@components/Button';
import ConnectivityStatus from '@components/ConnectivityStatus';
import TimerIndicator from '@components/TimerIndicator';
import { calculateGroupRadius, calculateGroupCenter, generateDummyShot } from '@utils/shootingUtils';
import { FaCaretUp, FaBullseye, FaPause, FaSave } from 'react-icons/fa';

export default function Live() {
    const {
        shots,
        sighterShots,
        currentShot,
        matchName,
        startTime,
        isRunning,
        mode,
        addShot,
        toggleMode,
        setMode,
        startSession,
        stopSession,
        saveSession,
        getTotalScore,
        getTotalScoreDecimal,
        getAllShots
    } = useLiveStore();

    const { eventType } = useEventStore();
    const [groupRadius, setGroupRadius] = useState(0);
    const [groupCenter, setGroupCenter] = useState(null);

    // Get all shots for display (sighter + match)
    const allShots = getAllShots();
    const displayShots = mode === 'sighter' ? sighterShots : shots;

    useEffect(() => {
        if (!isRunning && !matchName) {
            // Auto-start session if not already started
            const name = eventType || 'Guest - Free Series';
            startSession(name, 'sighter');
        }
    }, []);

    useEffect(() => {
        if (displayShots.length > 0) {
            setGroupRadius(calculateGroupRadius(displayShots));
            setGroupCenter(calculateGroupCenter(displayShots));
        }
    }, [displayShots]);

    const handleAddShot = () => {
        // Generate a dummy shot for demonstration
        const dummyShot = generateDummyShot(currentShot + 1);
        addShot(dummyShot);
    };

    const handleSave = () => {
        const session = saveSession();
        alert(`Session saved! Total score: ${session.totalScore} (${session.totalScoreDecimal.toFixed(1)})`);
    };

    const handleModeToggle = () => {
        if (mode === 'sighter') {
            const confirmSwitch = window.confirm('Switch to Match mode? Sighter shots will be saved separately.');
            if (confirmSwitch) {
                toggleMode();
            }
        } else {
            toggleMode();
        }
    };

    return (
        <div className="max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-100">{matchName || 'Live Shooting'}</h1>

                    {/* Status indicators */}
                    <div className="flex items-center space-x-3">
                        <TimerIndicator isRunning={isRunning} />
                        <ConnectivityStatus />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${mode === 'sighter'
                            ? 'bg-gray-600 text-gray-100'
                            : 'bg-accent-green text-white'
                            }`}>
                            {mode === 'sighter' ? <span className="flex items-center gap-2"><FaCaretUp /> Sighter Mode</span> : <span className="flex items-center gap-2"><FaBullseye /> Match Mode</span>}
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleModeToggle}
                        >
                            Switch to {mode === 'sighter' ? 'Match' : 'Sighter'}
                        </Button>
                    </div>

                    <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Current Shot</div>
                        <div className="text-5xl font-bold text-primary-400">{currentShot}</div>
                    </div>
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left panel - Target */}
                <div className="space-y-4">
                    <div className="card">
                        <TargetImage
                            shots={displayShots}
                            groupRadius={groupRadius}
                            groupCenter={groupCenter}
                            size={500}
                            showSighterIndicator={mode === 'sighter'}
                        />

                        {/* Stats below target */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-border">
                            <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Group Radius</div>
                                <div className="text-xl font-bold text-accent-green">
                                    {groupRadius || '0.00'}
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Group Centre</div>
                                <div className="text-sm text-gray-400">
                                    {groupCenter
                                        ? `(${groupCenter.x.toFixed(1)}, ${groupCenter.y.toFixed(1)})`
                                        : '(0, 0)'}
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Timer</div>
                                <Timer startTime={startTime} isRunning={isRunning} />
                            </div>
                        </div>
                    </div>

                    {/* Sighther button - large button at bottom */}
                    <Button
                        onClick={handleAddShot}
                        variant="success"
                        size="lg"
                        className="w-full text-lg py-4"
                    >
                        <span className="text-2xl mr-2"><FaBullseye /></span>
                        <span>Sighther</span>
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Click to start playing trail balls (like in cricket)
                    </p>
                </div>

                {/* Right panel - Shot table */}
                <div className="space-y-4">
                    <ShotTable
                        shots={displayShots}
                        totalScore={getTotalScore()}
                        totalScoreDecimal={getTotalScoreDecimal()}
                    />

                    {/* Shot counts */}
                    <div className="card">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-dark-elevated rounded p-3">
                                <div className="text-xs text-gray-500 mb-1">Sighter Shots</div>
                                <div className="text-2xl font-bold text-gray-400">{sighterShots.length}</div>
                            </div>
                            <div className="bg-dark-elevated rounded p-3">
                                <div className="text-xs text-gray-500 mb-1">Match Shots</div>
                                <div className="text-2xl font-bold text-primary-400">{shots.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <Button
                            variant="success"
                            onClick={handleSave}
                            className="flex-1 flex items-center justify-center space-x-2"
                        >
                            <FaSave className="w-5 h-5" />
                            <span>Save Session</span>
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={stopSession}
                            className="flex-1"
                        >
                            <span className="flex items-center justify-center gap-2"><FaPause /> Pause</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
