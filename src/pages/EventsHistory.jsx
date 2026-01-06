import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useHistoryStore } from '@store/historyStore';
import { useAuthStore } from '@store/authStore';
import Modal from '@components/Modal';
import TargetImage from '@components/TargetImage';
import ShotTable from '@components/ShotTable';
import MatchReport from '@components/MatchReport';
import ReportPreviewModal from '@components/ReportPreviewModal';
import { calculateGroupRadius, calculateGroupCenter } from '@utils/shootingUtils';
import { FaChartBar, FaCalendarAlt, FaBullseye, FaFilePdf, FaPrint, FaEye, FaSearch, FaFilter, FaSortAmountDown, FaCaretDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function EventsHistory() {
    const navigate = useNavigate();
    const { sessions } = useHistoryStore();
    const { user } = useAuthStore();
    const [selectedSession, setSelectedSession] = useState(null);
    const [showReportPreview, setShowReportPreview] = useState(false);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Process sessions: Filter -> Sort -> Group
    const groupedSessions = useMemo(() => {
        // 1. Filter
        let filtered = sessions.filter(session => {
            const matchesSearch = session.matchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.eventType?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDate = filterDate ? new Date(session.savedAt).toISOString().slice(0, 10) === filterDate : true;

            const matchesType = filterType === 'all' ? true :
                session.eventType?.toLowerCase() === filterType.toLowerCase();

            return matchesSearch && matchesDate && matchesType;
        });

        // 2. Sort (within the list before grouping)
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest': return new Date(b.savedAt) - new Date(a.savedAt);
                case 'oldest': return new Date(a.savedAt) - new Date(b.savedAt);
                case 'score-desc': return (b.totalScoreDecimal || b.totalScore) - (a.totalScoreDecimal || a.totalScore);
                case 'score-asc': return (a.totalScoreDecimal || a.totalScore) - (b.totalScoreDecimal || b.totalScore);
                default: return 0;
            }
        });

        // 3. Group by Date
        const grouped = {};
        filtered.forEach(session => {
            const date = new Date(session.savedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(session);
        });

        return grouped;
    }, [sessions, searchQuery, filterDate, filterType, sortBy]);

    const handleEventClick = (event) => {
        setSelectedSession(event);
    };

    const handleCloseModal = () => {
        setSelectedSession(null);
    };

    const handleViewInLiveMode = () => {
        if (!selectedSession) return;
        navigate('/live', {
            state: {
                viewOnly: true,
                pastSession: selectedSession,
                code: `HIST-${selectedSession.id || Math.random().toString(36).substr(2, 4).toUpperCase()}`
            }
        });
    };

    const groupRadius = selectedSession?.shots ? calculateGroupRadius(selectedSession.shots) : 0;
    const groupCenter = selectedSession?.shots ? calculateGroupCenter(selectedSession.shots) : null;

    // Get unique event types for filter dropdown
    const eventTypes = useMemo(() => {
        const types = new Set(sessions.map(s => s.eventType).filter(Boolean));
        return ['all', ...Array.from(types)];
    }, [sessions]);

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-text mb-2">Events History</h1>
                <p className="text-dark-muted">View and analyze your past shooting sessions</p>
            </div>

            {/* Control Bar */}
            <div className="glass-panel p-4 mb-8 rounded-2xl border border-dark-border flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-20 backdrop-blur-xl bg-dark-bg/80 shadow-2xl">
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-input w-full pl-10 py-2 rounded-xl text-sm"
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Date Filter */}
                    <div className="relative">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="glass-input py-2 px-3 rounded-xl text-sm min-w-[140px] appearance-none" // appearance-none to help styling
                        />
                        {!filterDate && <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted pointer-events-none" />}
                    </div>

                    {/* Type Filter */}
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted text-xs" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="glass-input pl-8 pr-8 py-2 rounded-xl text-sm capitalize appearance-none cursor-pointer"
                        >
                            {eventTypes.map(type => (
                                <option key={type} value={type} className="bg-dark-bg text-dark-text capitalize">
                                    {type === 'all' ? 'All Events' : type}
                                </option>
                            ))}
                        </select>
                        <FaCaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted text-xs pointer-events-none" />
                    </div>

                    {/* Sort Filter */}
                    <div className="relative">
                        <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted text-xs" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="glass-input pl-8 pr-8 py-2 rounded-xl text-sm appearance-none cursor-pointer"
                        >
                            <option value="newest" className="bg-dark-bg text-dark-text">Newest First</option>
                            <option value="oldest" className="bg-dark-bg text-dark-text">Oldest First</option>
                            <option value="score-desc" className="bg-dark-bg text-dark-text">Highest Score</option>
                            <option value="score-asc" className="bg-dark-bg text-dark-text">Lowest Score</option>
                        </select>
                        <FaCaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted text-xs pointer-events-none" />
                    </div>

                    {/* Clear Filters (if any active) */}
                    {(searchQuery || filterDate || filterType !== 'all' || sortBy !== 'newest') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterDate('');
                                setFilterType('all');
                                setSortBy('newest');
                            }}
                            className="text-xs text-red-400 hover:text-red-300 underline whitespace-nowrap px-2"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {Object.keys(groupedSessions).length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-dark-border">
                    <div className="text-6xl mb-6 flex justify-center text-dark-muted"><FaChartBar /></div>
                    <h2 className="text-2xl font-bold text-dark-text mb-2">No Matching Sessions</h2>
                    <p className="text-dark-muted max-w-md mx-auto">
                        Try adjusting your filters or search query to find what you're looking for.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setFilterDate('');
                            setFilterType('all');
                        }}
                        className="mt-6 btn btn-secondary"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(groupedSessions).map(([date, events]) => (
                        <div key={date} className="relative">
                            {/* Date Header using Sticky - adjusted top to account for new control bar */}
                            <div className="flex items-center gap-4 mb-6 sticky top-[5.5rem] z-10 bg-dark-bg/95 backdrop-blur-md py-4 rounded-xl border border-dark-border px-4 shadow-lg w-fit ml-2">
                                <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                                    <FaCalendarAlt size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-dark-text">{date}</h2>
                                <span className="bg-dark-elevated px-2 py-0.5 rounded text-xs text-dark-muted border border-dark-border">{events.length}</span>
                            </div>

                            {/* Session Tiles Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-4 border-l-2 border-dark-border ml-4">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event)}
                                        className="btn-secondary group relative overflow-hidden p-0 rounded-2xl cursor-pointer hover:shadow-xl dark:hover:shadow-neon transition-all duration-300 h-full flex flex-col text-left border-0"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-accent-purple opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="p-5 flex-1 w-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-primary-500/10 rounded-lg text-2xl group-hover:scale-110 transition-transform text-primary-600 dark:text-white">
                                                    <FaBullseye />
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-dark-muted font-mono">
                                                        {new Date(event.savedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-dark-text mb-1 truncate pr-2" title={event.matchName}>
                                                {event.matchName}
                                            </h3>
                                            <p className="text-xs text-dark-muted uppercase tracking-wider mb-4">
                                                {event.eventType || 'Unknown Event'}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                                <div className="bg-dark-bg/50 rounded-lg p-2 text-center border border-dark-border">
                                                    <div className="text-[10px] text-dark-muted uppercase">Score</div>
                                                    <div className="font-bold text-accent-green text-lg">{event.totalScoreDecimal?.toFixed(1) || event.totalScore}</div>
                                                </div>
                                                <div className="bg-dark-bg/50 rounded-lg p-2 text-center border border-dark-border">
                                                    <div className="text-[10px] text-dark-muted uppercase">Shots</div>
                                                    <div className="font-bold text-primary-500 text-lg">{event.shots?.length || 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Session Detail Modal */}
            {selectedSession && (
                <Modal isOpen={true} onClose={handleCloseModal} title={selectedSession.matchName}>
                    <div className="space-y-6">
                        {/* Header Actions */}
                        <div className="flex justify-end gap-3 sticky top-0 bg-dark-bg/95 py-2 z-20 border-b border-dark-border mb-4">
                            <button
                                onClick={handleViewInLiveMode}
                                className="btn bg-accent-cyan/90 hover:bg-accent-cyan text-black text-sm py-2 px-4 shadow-lg shadow-accent-cyan/20 flex items-center"
                            >
                                <FaEye className="mr-2" /> View in Live Mode
                            </button>
                            <button
                                onClick={() => setShowReportPreview(true)}
                                className="btn btn-primary text-sm py-2 px-4 shadow-lg shadow-primary-500/20 flex items-center"
                            >
                                <FaFilePdf className="mr-2" /> Generate Report
                            </button>
                        </div>

                        {/* Session Info */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="glass-panel rounded-xl p-4 text-center">
                                <div className="text-xs text-dark-muted mb-1 uppercase tracking-wider">Total Shots</div>
                                <div className="text-3xl font-bold text-primary-500 font-mono">
                                    {selectedSession.shots?.length || 0}
                                </div>
                            </div>
                            <div className="glass-panel rounded-xl p-4 text-center">
                                <div className="text-xs text-dark-muted mb-1 uppercase tracking-wider">Integer</div>
                                <div className="text-3xl font-bold text-accent-green font-mono">
                                    {selectedSession.totalScore || 0}
                                </div>
                            </div>
                            <div className="glass-panel rounded-xl p-4 text-center">
                                <div className="text-xs text-dark-muted mb-1 uppercase tracking-wider">Decimal</div>
                                <div className="text-3xl font-bold text-accent-cyan font-mono">
                                    {selectedSession.totalScoreDecimal?.toFixed(1) || '0.0'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Target View */}
                            <div className="glass-panel rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center">
                                    <FaBullseye className="mr-2 text-primary-500" /> Target Analysis
                                </h3>
                                <div className="flex justify-center">
                                    <TargetImage
                                        shots={selectedSession.shots || []}
                                        groupRadius={groupRadius}
                                        groupCenter={groupCenter}
                                        size={400}
                                    />
                                </div>
                            </div>

                            {/* Shot Table */}
                            <div className="glass-panel rounded-2xl p-6 flex flex-col h-[500px]">
                                <h3 className="text-lg font-semibold text-dark-text mb-4">Shot Details</h3>
                                <div className="flex-1 overflow-hidden rounded-xl border border-dark-border">
                                    <ShotTable
                                        shots={selectedSession.shots || []}
                                        totalScore={selectedSession.totalScore || 0}
                                        totalScoreDecimal={selectedSession.totalScoreDecimal || 0}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Conditional Report Preview Modal */}
                        {showReportPreview && (
                            <ReportPreviewModal
                                isOpen={showReportPreview}
                                onClose={() => setShowReportPreview(false)}
                                session={selectedSession}
                                user={user}
                            />
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}
