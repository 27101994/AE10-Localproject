import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLiveStore } from '@store/liveStore';
import { useEventStore } from '@store/eventStore';
import { useAuthStore } from '@store/authStore';
import TargetImage from '@components/TargetImage';
import ShotTable from '@components/ShotTable';
import Timer from '@components/Timer';
import Button from '@components/Button';
import ConnectivityStatus from '@components/ConnectivityStatus';
import TimerIndicator from '@components/TimerIndicator';
import MatchReport from '@components/MatchReport';
import ReportPreviewModal from '@components/ReportPreviewModal';
import { calculateGroupRadius, calculateGroupCenter, generateDummyShot } from '@utils/shootingUtils';
import { FaCaretUp, FaBullseye, FaPause, FaSave, FaRedo, FaSearchPlus, FaSearchMinus, FaToggleOn, FaToggleOff, FaQrcode, FaFilePdf, FaEye, FaSync, FaArrowLeft } from 'react-icons/fa';

export default function Live() {
    const navigate = useNavigate();
    const location = useLocation();
    const { viewOnly, code } = location.state || {}; // Check for view-only mode

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
    const [showReportPreview, setShowReportPreview] = useState(false);

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

    // Construct current session object for report
    const currentSession = {
        matchName: matchName || eventType || 'Live Session',
        eventType: selectedEvent?.name || eventType || 'Unknown',
        shots: displayShots,
        totalScore: getTotalScore(),
        totalScoreDecimal: getTotalScoreDecimal(),
        savedAt: new Date().toISOString(),
        duration: Date.now() - (startTime || Date.now()),
    };


    // Filter shots by series if selected
    const filteredShots = React.useMemo(() => {
        if (selectedSeries === 'all') return displayShots;

        const startIdx = selectedSeries * 10;
        const endIdx = startIdx + 10;
        return displayShots.slice(startIdx, endIdx);
    }, [displayShots, selectedSeries]);

    // Calculate Series Count
    const totalSeries = Math.ceil(Math.max(displayShots.length, 1) / 10);

    useEffect(() => {
        // If viewOnly, we don't start a new session, we assume data is coming from store (mocked for now)
        if (!viewOnly && !isRunning && !matchName) {
            const name = eventType || 'Guest - Free Series';
            startSession(name, 'sighter');
        }
    }, [viewOnly]);

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
        const nextNum = displayShots.length + 1;
        const dummyShot = generateDummyShot(nextNum);
        addShot(dummyShot);
    };

    const handleSave = () => {
        const session = saveSession();
        alert(`Session saved! Total score: ${session.totalScore} (${session.totalScoreDecimal.toFixed(1)})`);
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

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        const newZoom = Math.min(Math.max(zoom + delta, 0.5), 4);
        setZoom(newZoom);
    };

    return (
        <div className="max-w-[1920px] mx-auto h-screen flex flex-col p-3 overflow-hidden bg-dark-bg">
            {/* Custom Header with Toolbar */}
            <div className={`glass-panel p-2 mb-2 flex items-center justify-between shrink-0 ${viewOnly ? 'border-primary-500 shadow-primary-500/10' : ''}`}>

                {/* Left: Info */}
                <div className="flex items-center space-x-6">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2" title="Go Back">
                        <FaArrowLeft />
                    </Button>
                    <div>
                        <div className="text-[10px] text-dark-muted uppercase tracking-widest">Event</div>
                        <div className="text-base font-bold text-dark-text leading-tight">{matchName}</div>
                    </div>
                    {!viewOnly && (
                        <div className="flex items-center gap-1.5 ml-2">
                            <div className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${mode === 'sighter' ? 'bg-dark-elevated text-dark-text' : 'bg-red-600 text-white animate-pulse-slow'}`}>
                                {mode === 'sighter' ? <FaCaretUp /> : <FaBullseye />}
                                {mode === 'sighter' ? 'SIGHTER' : 'MATCH'}
                            </div>
                            <Button variant="secondary" size="xs" onClick={toggleMode} className="text-[10px]">
                                <FaSync className="mr-1" /> Switch
                            </Button>
                        </div>
                    )}
                </div>

                {/* Center/Right: Toolbar Actions (Save, Report, Restart, Live) */}
                {!viewOnly && (
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-px bg-dark-border mx-2"></div>

                        <Button variant="ghost" size="sm" onClick={stopSession} title="Pause">
                            <FaPause className="text-dark-muted hover:text-white" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleSave} title="Save Session">
                            <FaSave className="text-primary-500 hover:text-primary-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowReportPreview(true)} title="Generate Report">
                            <FaFilePdf className="text-purple-500 hover:text-purple-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleRestart} title="Restart Event">
                            <FaRedo className="text-red-500 hover:text-red-400" />
                        </Button>

                        {/* Live View Toggle */}
                        <div className="flex items-center gap-2 ml-4">
                            {isLiveViewEnabled && showLiveCode && (
                                <span className="font-mono font-bold text-sm bg-white text-black px-2 rounded">Code: 4829</span>
                            )}
                            <button
                                onClick={toggleLiveView}
                                className={`p-1.5 rounded-lg transition-colors ${isLiveViewEnabled ? 'text-green-500' : 'text-dark-muted hover:text-white'}`}
                                title="Toggle Live View"
                            >
                                {isLiveViewEnabled ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                            </button>
                            <FaQrcode className="text-dark-muted" />
                        </div>

                        <div className="h-6 w-px bg-dark-border mx-2"></div>

                        {/* Timer & Status */}
                        <div className="flex items-center gap-3">
                            <TimerIndicator isRunning={isRunning} />
                            <Timer startTime={startTime} isRunning={isRunning} />
                            <ConnectivityStatus />
                        </div>
                    </div>
                )}

                {viewOnly && (
                    <div className="flex items-center gap-2 bg-red-600/10 px-4 py-1 rounded border border-red-500 text-red-500 animate-pulse">
                        <FaEye />
                        <span className="font-bold text-sm">VIEW ONLY: {code}</span>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT: 2 COLUMNS (Left Target+Footer | Right Full Table) */}
            <div className={`flex-1 flex gap-3 min-h-0 overflow-hidden ${viewOnly ? 'h-full' : ''}`}>

                {/* LEFT PANEL: TARGET & FOOTER CONTROLS */}
                <div className="flex-[3] flex flex-col gap-3 min-h-0">

                    {/* 1. TARGET (Maximized) */}
                    <div className="flex-1 flex flex-col min-h-0 relative bg-dark-bg/30 rounded-xl border border-white/5 shadow-inner">
                        <div className="flex-1 flex items-center justify-center relative overflow-hidden p-1">
                            <div className="relative aspect-square h-full w-auto flex flex-col overflow-hidden mx-auto rounded-lg shadow-2xl bg-black/20 border border-white/5">
                                {/* Zoom Overlays */}
                                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                                    <div className="bg-dark-elevated/90 backdrop-blur-sm p-1 rounded shadow flex flex-col gap-1">
                                        <button onClick={() => setZoom(z => Math.min(z + 0.5, 4))} className="p-1 hover:bg-primary-500 hover:text-white rounded" title="Zoom In"><FaSearchPlus size={12} /></button>
                                        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1 hover:bg-primary-500 hover:text-white rounded" title="Reset"><FaRedo size={10} /></button>
                                        <button onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))} className="p-1 hover:bg-primary-500 hover:text-white rounded" title="Zoom Out"><FaSearchMinus size={12} /></button>
                                    </div>
                                </div>

                                {/* Sighter Indicator Overlay (Fixed Position) */}
                                {mode === 'sighter' && (
                                    <div className="absolute top-0 right-0 z-10 pointer-events-none">
                                        <svg width="100" height="100" viewBox="0 0 100 100">
                                            <polygon points="0,0 100,0 100,100" fill="rgba(128, 128, 128, 0.5)" />
                                        </svg>
                                    </div>
                                )}

                                {/* Target */}
                                <div
                                    className="flex-1 flex items-center justify-center overflow-hidden cursor-move active:cursor-grabbing relative"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onWheel={handleWheel}
                                >
                                    <div
                                        style={{
                                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                                        }}
                                        className="origin-center"
                                    >
                                        <TargetImage
                                            shots={filteredShots}
                                            groupRadius={groupRadius}
                                            groupCenter={groupCenter}
                                            size={750}
                                            showSighterIndicator={mode === 'sighter'}
                                            targetType={selectedEvent?.type || 'pistol'}
                                            zoom={zoom}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. FOOTER: STATS & ACTION CONTROLS (Moved from Sidebar) */}
                    {!viewOnly && (
                        <div className="h-16 shrink-0 flex gap-3">
                            {/* Stats: Group & Shot */}
                            <div className="flex-[2] glass-panel px-4 flex items-center justify-around">
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] text-dark-muted uppercase font-bold tracking-wider">Group Radius</div>
                                    <div className="text-2xl font-bold text-accent-green leading-none">{groupRadius || '0.00'}</div>
                                </div>
                                <div className="h-8 w-px bg-dark-border/50"></div>
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] text-dark-muted uppercase font-bold tracking-wider">Current Shot</div>
                                    <div className="text-3xl font-bold text-dark-text leading-none">{displayShots.length > 0 ? displayShots[displayShots.length - 1].number : 0}</div>
                                </div>
                            </div>

                            {/* Series Selector */}
                            <div className="flex-[3] glass-panel p-2 flex items-center overflow-x-auto">
                                <div className="flex items-center gap-1.5 mx-auto">
                                    <button onClick={() => setSelectedSeries('all')} className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all ${selectedSeries === 'all' ? 'bg-primary-500 text-white' : 'bg-dark-elevated text-dark-muted'}`}>ALL</button>
                                    {Array.from({ length: totalSeries }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSeries(idx)}
                                            className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all ${selectedSeries === idx ? 'bg-primary-500 text-white' : 'bg-dark-elevated text-dark-muted'} ${(idx + 1) * 10 <= displayShots.length ? 'border-b border-green-500' : ''}`}
                                        >
                                            S{idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* FIRE BUTTON */}
                            <div className="flex-[2]">
                                <Button onClick={handleAddShot} variant="success" size="lg" className="w-full h-full text-lg shadow-lg shadow-green-500/10 hover:shadow-green-500/20">
                                    <FaBullseye className="mr-2" /> FIRE SHOT
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: FULL HEIGHT TABLE (Fixed Width) */}
                <div className="w-[380px] flex flex-col min-h-0 bg-dark-bg/20 rounded-xl overflow-hidden border border-dark-border/30">
                    <ShotTable
                        shots={filteredShots}
                        totalScore={getTotalScore()}
                        totalScoreDecimal={getTotalScoreDecimal()}
                        compact={true}
                    />
                </div>

                {/* Hidden Report Component - Only needed for host printing */}
                {!viewOnly && (
                    <ReportPreviewModal
                        isOpen={showReportPreview}
                        onClose={() => setShowReportPreview(false)}
                        session={currentSession}
                        user={user}
                    />
                )}
            </div>
        </div>
    );
}
