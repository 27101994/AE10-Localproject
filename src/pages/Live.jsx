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
        shots: storeShots,
        sighterShots: storeSighterShots,
        currentShot: storeCurrentShot,
        matchName: storeMatchName,
        startTime: storeStartTime,
        isRunning: storeIsRunning,
        mode: storeMode,
        addShot,
        toggleMode: storeToggleMode,
        startSession,
        stopSession,
        saveSession,
        getTotalScore,
        getTotalScoreDecimal,
    } = useLiveStore();

    const { eventType, selectedEvent } = useEventStore();
    const { user } = useAuthStore();

    // Determine if we are viewing a past session
    const pastSession = location.state?.pastSession;
    const isHistoricalView = !!pastSession;

    // Use local mode for historical view to allow toggling between sighter/match
    const [localMode, setLocalMode] = useState(pastSession?.mode || 'match');

    // Override store values with past session data if applicable
    const activeShots = isHistoricalView ? (pastSession.shots || []) : storeShots;
    const activeSighterShots = isHistoricalView ? (pastSession.sighterShots || []) : storeSighterShots;
    const activeMatchName = isHistoricalView ? pastSession.matchName : storeMatchName;
    const activeStartTime = isHistoricalView ? (new Date(pastSession.savedAt).getTime() - (pastSession.duration || 0)) : storeStartTime;
    const activeIsRunning = isHistoricalView ? false : storeIsRunning;
    const activeMode = isHistoricalView ? localMode : storeMode;

    const activeToggleMode = () => {
        if (isHistoricalView) {
            setLocalMode(prev => prev === 'sighter' ? 'match' : 'sighter');
        } else {
            storeToggleMode();
        }
    };

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
    const displayShots = activeMode === 'sighter' ? activeSighterShots : activeShots;

    // Construct current session object for report
    const currentSession = pastSession || {
        matchName: activeMatchName || eventType || 'Live Session',
        eventType: selectedEvent?.name || eventType || 'Unknown',
        shots: displayShots,
        totalScore: getTotalScore(),
        totalScoreDecimal: getTotalScoreDecimal(),
        savedAt: new Date().toISOString(),
        duration: Date.now() - (activeStartTime || Date.now()),
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
        if (!viewOnly && !isHistoricalView && !storeIsRunning && !storeMatchName) {
            const name = eventType || 'Guest - Free Series';
            startSession(name, 'sighter');
        }
    }, [viewOnly, isHistoricalView]);

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
        if (isHistoricalView) return; // Disable live view toggle for historical sessions
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
                        <div className="text-base font-bold text-dark-text leading-tight">{activeMatchName}</div>
                    </div>
                    {!viewOnly && !isHistoricalView && (
                        <div className="flex items-center ml-4">
                            <div className="glass-panel p-1 rounded-full flex items-center bg-black/40 border border-white/5">
                                <button
                                    onClick={() => activeMode !== 'sighter' && activeToggleMode()}
                                    className={`
                                        px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 flex items-center gap-2
                                        ${activeMode === 'sighter'
                                            ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                                            : 'text-dark-muted hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <FaCaretUp className={activeMode === 'sighter' ? 'animate-bounce-slow' : ''} />
                                    SIGHTER
                                </button>
                                <button
                                    onClick={() => activeMode !== 'match' && activeToggleMode()}
                                    className={`
                                        px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 flex items-center gap-2
                                        ${activeMode === 'match'
                                            ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse-slow'
                                            : 'text-dark-muted hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <FaBullseye />
                                    MATCH
                                </button>
                            </div>
                        </div>
                    )}

                    {isHistoricalView && (
                        <div className="flex items-center ml-4">
                            <div className="glass-panel p-1 rounded-full flex items-center bg-black/40 border border-white/5">
                                <button
                                    onClick={() => activeMode !== 'sighter' && activeToggleMode()}
                                    className={`
                                         px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 flex items-center gap-2
                                         ${activeMode === 'sighter'
                                            ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                                            : 'text-dark-muted hover:text-white hover:bg-white/5'}
                                     `}
                                >
                                    SIGHTER ({activeSighterShots.length})
                                </button>
                                <button
                                    onClick={() => activeMode !== 'match' && activeToggleMode()}
                                    className={`
                                         px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 flex items-center gap-2
                                         ${activeMode === 'match'
                                            ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                                            : 'text-dark-muted hover:text-white hover:bg-white/5'}
                                     `}
                                >
                                    MATCH ({activeShots.length})
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Center/Right: Toolbar Actions (Save, Report, Restart, Live) */}
                {!viewOnly && !isHistoricalView && (
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-px bg-dark-border mx-2"></div>

                        <Button variant="ghost" size="sm" onClick={stopSession} title="Pause" className="p-2">
                            <FaPause size={22} className="text-dark-muted hover:text-white" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleSave} title="Save Session" className="p-2">
                            <FaSave size={22} className="text-primary-500 hover:text-primary-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowReportPreview(true)} title="Generate Report" className="p-2">
                            <FaFilePdf size={22} className="text-purple-500 hover:text-purple-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleRestart} title="Restart Event" className="p-2">
                            <FaRedo size={22} className="text-red-500 hover:text-red-400" />
                        </Button>

                        {/* Live View Toggle */}
                        <div className="flex items-center gap-3 ml-4">
                            {isLiveViewEnabled && showLiveCode && (
                                <span className="font-mono font-bold text-sm bg-white text-black px-2 rounded">Code: 4829</span>
                            )}
                            <button
                                onClick={toggleLiveView}
                                className={`p-2 rounded-lg transition-colors ${isLiveViewEnabled ? 'text-green-500' : 'text-dark-muted hover:text-white'}`}
                                title="Toggle Live View"
                            >
                                {isLiveViewEnabled ? <FaToggleOn size={28} /> : <FaToggleOff size={28} />}
                            </button>
                            <FaQrcode size={24} className="text-dark-muted" />
                        </div>

                        <div className="h-6 w-px bg-dark-border mx-2"></div>

                        {/* Timer & Status */}
                        <div className="flex items-center gap-3">
                            <TimerIndicator isRunning={activeIsRunning} />
                            <Timer startTime={activeStartTime} isRunning={activeIsRunning} />
                            <ConnectivityStatus />
                        </div>
                    </div>
                )}

                {isHistoricalView && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-dark-elevated px-4 py-2 rounded-xl border border-white/10">
                            <FaEye className="text-primary-500" />
                            <span className="font-bold text-sm uppercase tracking-wider">Historical Review</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowReportPreview(true)} title="Generate Report" className="p-2">
                            <FaFilePdf size={22} className="text-purple-500 hover:text-purple-400" />
                        </Button>
                        <div className="h-6 w-px bg-dark-border mx-2"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-dark-muted uppercase font-bold">Total Score:</span>
                            <span className="text-lg font-bold text-accent-cyan">{pastSession.totalScoreDecimal?.toFixed(1)}</span>
                            <span className="text-xs text-dark-muted">({pastSession.totalScore})</span>
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
                            <div className="relative w-full h-full flex flex-col overflow-hidden items-center justify-center">
                                {/* Zoom Overlays */}
                                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                    <div className="bg-dark-elevated/95 backdrop-blur-md p-1.5 rounded-xl shadow-xl flex flex-col gap-2 border border-white/10">
                                        <button onClick={() => setZoom(z => Math.min(z + 0.5, 4))} className="p-2.5 hover:bg-primary-500 hover:text-white rounded-lg transition-colors" title="Zoom In"><FaSearchPlus size={20} /></button>
                                        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2.5 hover:bg-primary-500 hover:text-white rounded-lg transition-colors" title="Reset"><FaRedo size={18} /></button>
                                        <button onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))} className="p-2.5 hover:bg-primary-500 hover:text-white rounded-lg transition-colors" title="Zoom Out"><FaSearchMinus size={20} /></button>
                                    </div>
                                </div>

                                {/* Sighter Indicator Overlay (Fixed Position) */}
                                {activeMode === 'sighter' && (
                                    <div className="absolute top-0 right-0 z-10 pointer-events-none">
                                        <svg width="100" height="100" viewBox="0 0 100 100">
                                            <polygon points="0,0 100,0 100,100" fill="rgba(0, 0, 0, 0.85)" />
                                        </svg>
                                    </div>
                                )}

                                {/* Target Container - Responsive */}
                                <div
                                    className="w-full h-full flex items-center justify-center overflow-hidden cursor-move active:cursor-grabbing relative"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onWheel={handleWheel}
                                >
                                    <div
                                        style={{
                                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        className="origin-center"
                                    >
                                        <TargetImage
                                            shots={filteredShots}
                                            groupRadius={groupRadius}
                                            groupCenter={groupCenter}
                                            size={1000}
                                            showSighterIndicator={activeMode === 'sighter'}
                                            targetType={selectedEvent?.type || (pastSession?.eventType?.toLowerCase().includes('rifle') ? 'rifle' : 'pistol')}
                                            zoom={zoom}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. FOOTER: STATS & ACTION CONTROLS (Moved from Sidebar) */}
                    {!viewOnly && !isHistoricalView && (
                        <div className="h-14 shrink-0 flex gap-3">
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

                    {isHistoricalView && (
                        <div className="h-14 shrink-0 flex gap-3">
                            <div className="flex-[2] glass-panel px-4 flex items-center justify-around">
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] text-dark-muted uppercase font-bold tracking-wider">Group Radius</div>
                                    <div className="text-2xl font-bold text-accent-green leading-none">{groupRadius || '0.00'}</div>
                                </div>
                            </div>

                            <div className="flex-[3] glass-panel p-2 flex items-center overflow-x-auto">
                                <div className="flex items-center gap-1.5 mx-auto">
                                    <button onClick={() => setSelectedSeries('all')} className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all ${selectedSeries === 'all' ? 'bg-primary-500 text-white' : 'bg-dark-elevated text-dark-muted'}`}>ALL</button>
                                    {Array.from({ length: totalSeries }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSeries(idx)}
                                            className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all ${selectedSeries === idx ? 'bg-primary-500 text-white' : 'bg-dark-elevated text-dark-muted'}`}
                                        >
                                            S{idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-[2] glass-panel px-4 flex flex-col items-center justify-center">
                                <div className="text-[10px] text-dark-muted uppercase font-bold tracking-wider">Total Shots</div>
                                <div className="text-2xl font-bold text-dark-text leading-none">{displayShots.length}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: FULL HEIGHT TABLE (Fixed Width) */}
                <div className="w-[380px] flex flex-col min-h-0 bg-dark-bg/20 rounded-xl overflow-hidden border border-dark-border/30">
                    <ShotTable
                        shots={filteredShots}
                        totalScore={isHistoricalView ? pastSession.totalScore : getTotalScore()}
                        totalScoreDecimal={isHistoricalView ? pastSession.totalScoreDecimal : getTotalScoreDecimal()}
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
