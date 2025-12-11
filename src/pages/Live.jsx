import React, { useState, useEffect } from 'react';
import { useLiveStore } from '@store/liveStore';
import { useEventStore } from '@store/eventStore';
import { useAuthStore } from '@store/authStore';
import TargetImage from '@components/TargetImage';
import ShotTable from '@components/ShotTable';
import Timer from '@components/Timer';
import Button from '@components/Button';
import ConnectivityStatus from '@components/ConnectivityStatus';
import TimerIndicator from '@components/TimerIndicator';
import { calculateGroupRadius, calculateGroupCenter, generateDummyShot } from '@utils/shootingUtils';
import { FaCaretUp, FaBullseye, FaPause, FaSave, FaRedo, FaSearchPlus, FaSearchMinus, FaToggleOn, FaToggleOff, FaQrcode } from 'react-icons/fa';

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
        startSession,
        stopSession,
        saveSession,
        getTotalScore,
        getTotalScoreDecimal,
        getAllShots
    } = useLiveStore();

    const { eventType, selectedEvent } = useEventStore();
    const { user } = useAuthStore();

    // Local State
    const [groupRadius, setGroupRadius] = useState(0);
    const [groupCenter, setGroupCenter] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [selectedSeries, setSelectedSeries] = useState('all'); // 'all' or index 0, 1, 2...
    const [showLiveCode, setShowLiveCode] = useState(false);
    const [isLiveViewEnabled, setIsLiveViewEnabled] = useState(false);

    // Zoom & Pan State
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Derived Data
    const displayShots = mode === 'sighter' ? sighterShots : shots;

    // Filter shots by series if selected
    const filteredShots = React.useMemo(() => {
        if (selectedSeries === 'all') return displayShots;

        const startIdx = selectedSeries * 10;
        const endIdx = startIdx + 10;
        // Adjust for 0-based index vs generic slicing
        // Assuming shots are ordered by insertion.
        // We need to filter by 'series' property if available, or just by index chunk
        return displayShots.slice(startIdx, endIdx);
    }, [displayShots, selectedSeries]);

    // Calculate Series Count
    const totalSeries = Math.ceil(Math.max(displayShots.length, 1) / 10);

    useEffect(() => {
        if (!isRunning && !matchName) {
            const name = eventType || 'Guest - Free Series';
            startSession(name, 'sighter');
        }
    }, []);

    useEffect(() => {
        if (filteredShots.length > 0) {
            setGroupRadius(calculateGroupRadius(filteredShots));
            setGroupCenter(calculateGroupCenter(filteredShots));
        } else {
            setGroupRadius(0);
            setGroupCenter(null);
        }
    }, [filteredShots]);

    const handleAddShot = () => {
        // Generate a dummy shot for demonstration
        // Use current total count (sighter + match) for shot number consistency if needed, 
        // but typically each series starts or continues.
        // For simplicity, just increment based on current mode count
        const nextNum = displayShots.length + 1;
        const dummyShot = generateDummyShot(nextNum);
        addShot(dummyShot);
    };

    const handleSave = () => {
        const session = saveSession();
        alert(`Session saved! Total score: ${session.totalScore} (${session.totalScoreDecimal.toFixed(1)})`);
    };

    const handleModeToggle = () => {
        if (mode === 'sighter') {
            // Switching to Match - Confirmation
            // Requirement: "Switch to match mode(No chnage)" - assuming no confirmation needed or simple toggle
            // Requirement: "Disconnected and connected to red to green box" - that's device status
            toggleMode();
            // Reset series selection when switching modes
            setSelectedSeries('all');
        } else {
            // Switching back to Sighter
            const confirmSwitch = window.confirm('Switch back to Sighter?');
            if (confirmSwitch) {
                toggleMode();
                setSelectedSeries('all');
            }
        }
    };

    const handleRestart = () => {
        if (window.confirm('Are you sure you want to restart the event? All progress will be lost.')) {
            const name = eventType || 'Guest - Free Series';
            startSession(name, 'sighter'); // Reset to sighter
        }
    };

    const toggleLiveView = () => {
        setIsLiveViewEnabled(!isLiveViewEnabled);
        if (!isLiveViewEnabled) setShowLiveCode(true); // Auto show code when enabling
    };

    return (
        <div className="max-w-[1920px] mx-auto h-screen flex flex-col p-4 overflow-hidden">
            {/* Custom Header for Live Page */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-4 mb-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-8">
                    {/* Event Name */}
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Event</div>
                        <div className="text-xl font-bold text-white">{matchName}</div>
                    </div>
                    {/* Shooter Name */}
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Shooter</div>
                        <div className="text-xl font-bold text-primary-400">{user?.name || 'Guest'}</div>
                    </div>
                </div>

                {/* Connectivity & Timer */}
                <div className="flex items-center space-x-8">
                    <div className="flex items-center gap-3 bg-dark-bg px-4 py-2 rounded-lg border border-dark-border">
                        <TimerIndicator isRunning={isRunning} />
                        <div className="h-8 w-px bg-dark-border"></div>
                        <Timer startTime={startTime} isRunning={isRunning} />
                    </div>
                    <ConnectivityStatus />
                </div>
            </div>

            {/* Main Control Bar */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    {/* Mode Switcher */}
                    <div className={`px-4 py-2 rounded-lg font-bold text-lg flex items-center gap-2 transition-colors ${mode === 'sighter' ? 'bg-gray-700 text-white' : 'bg-red-600 text-white animate-pulse-slow'
                        }`}>
                        {mode === 'sighter' ? <FaCaretUp /> : <FaBullseye />}
                        {mode === 'sighter' ? 'SIGHTER MODE' : 'MATCH MODE'}
                    </div>

                    <Button variant="secondary" onClick={handleModeToggle}>
                        Switch to {mode === 'sighter' ? 'Match' : 'Sighter'}
                    </Button>

                    <Button variant="danger" onClick={handleRestart} className="flex items-center gap-2">
                        <FaRedo /> Restart Event
                    </Button>
                </div>

                {/* Live View Controls */}
                <div className="flex items-center space-x-4">
                    {isLiveViewEnabled && showLiveCode && (
                        <div className="bg-white text-black px-3 py-1 rounded font-mono font-bold tracking-widest border border-primary-500">
                            CODE: 4829
                        </div>
                    )}
                    <button
                        onClick={toggleLiveView}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${isLiveViewEnabled ? 'border-primary-500 text-primary-400 bg-primary-500/10' : 'border-gray-600 text-gray-400'
                            }`}
                    >
                        {isLiveViewEnabled ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl" />}
                        <span className="font-bold">LIVE VIEW</span>
                        <FaQrcode />
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left: Target (7 cols) */}
                <div className="col-span-7 flex flex-col space-y-4 min-h-0">
                    <div className="card flex-1 flex flex-col relative overflow-hidden bg-dark-bg/50 backdrop-blur-sm">
                        {/* Zoom & Pan Controls */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            <div className="bg-dark-elevated p-1 rounded-lg shadow-lg flex flex-col gap-1">
                                <button onClick={() => setZoom(z => Math.min(z + 0.5, 8))} className="p-2 hover:bg-primary-500 hover:text-white rounded transition-colors" title="Zoom In"><FaSearchPlus /></button>
                                <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 hover:bg-primary-500 hover:text-white rounded transition-colors" title="Reset View"><FaRedo className="scale-75" /></button>
                                <button onClick={() => setZoom(z => Math.max(z - 0.5, 1))} className="p-2 hover:bg-primary-500 hover:text-white rounded transition-colors" title="Zoom Out"><FaSearchMinus /></button>
                            </div>
                        </div>

                        {/* panning instructions */}
                        {zoom > 1 && (
                            <div className="absolute top-4 right-4 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                Drag to Pan
                            </div>
                        )}

                        {/* Target Container with Zoom & Pan */}
                        <div
                            className="flex-1 flex items-center justify-center overflow-hidden cursor-move active:cursor-grabbing relative"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <div
                                style={{
                                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                                }}
                                className="origin-center"
                            >
                                <TargetImage
                                    shots={filteredShots}
                                    groupRadius={groupRadius}
                                    groupCenter={groupCenter}
                                    size={600}
                                    showSighterIndicator={mode === 'sighter'}
                                    targetType={selectedEvent?.type || 'pistol'}
                                />
                            </div>
                        </div>

                        {/* Series Selection Bar */}
                        <div className="mt-4 pt-4 border-t border-dark-border overflow-x-auto">
                            <div className="flex items-center gap-2 pb-2">
                                <button
                                    onClick={() => setSelectedSeries('all')}
                                    className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${selectedSeries === 'all' ? 'bg-primary-500 text-white' : 'bg-dark-elevated text-gray-400 hover:bg-dark-elevated/80'
                                        }`}
                                >
                                    ALL
                                </button>
                                {Array.from({ length: totalSeries }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSeries(idx)}
                                        className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${selectedSeries === idx ? 'bg-primary-500 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-bg' : 'bg-dark-elevated text-gray-400 hover:text-white'
                                            } ${
                                            // Highlight completed series (full 10 shots)
                                            (idx + 1) * 10 <= displayShots.length ? 'border-b-2 border-green-500' : ''
                                            }`}
                                    >
                                        S{idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sighter Button / Action Bar */}
                    <div className="flex space-x-4">
                        <div className="flex-1 bg-dark-surface rounded-xl p-4 flex items-center justify-around border border-dark-border">
                            <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase">Radius</div>
                                <div className="text-2xl font-bold text-accent-green">{groupRadius || '0.00'}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase">Shot</div>
                                <div className="text-4xl font-bold text-white">{displayShots.length > 0 ? displayShots[displayShots.length - 1].number : 0}</div>
                            </div>
                        </div>

                        <Button
                            onClick={handleAddShot}
                            variant="success"
                            size="lg"
                            className="flex-1 text-2xl"
                        >
                            <FaBullseye className="mr-2" /> FIRE SHOT
                        </Button>
                    </div>
                </div>

                {/* Right: Table (5 cols) */}
                <div className="col-span-5 flex flex-col min-h-0">
                    <ShotTable
                        shots={filteredShots}
                        totalScore={getTotalScore()}
                        totalScoreDecimal={getTotalScoreDecimal()}
                    />

                    <div className="mt-4 flex space-x-4">
                        <Button variant="secondary" onClick={stopSession} className="flex-1">
                            <FaPause className="mr-2" /> Pause
                        </Button>
                        <Button variant="primary" onClick={handleSave} className="flex-1">
                            <FaSave className="mr-2" /> Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
