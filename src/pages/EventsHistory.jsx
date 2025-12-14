import React, { useEffect, useState, useRef } from 'react';
import { useHistoryStore } from '@store/historyStore';
import { useAuthStore } from '@store/authStore';
import Modal from '@components/Modal';
import TargetImage from '@components/TargetImage';
import ShotTable from '@components/ShotTable';
import MatchReport from '@components/MatchReport';
import { calculateGroupRadius, calculateGroupCenter } from '@utils/shootingUtils';
import { FaChartBar, FaCalendarAlt, FaBullseye, FaFilePdf, FaPrint } from 'react-icons/fa';

export default function EventsHistory() {
    const { sessions, getSessionsByDate } = useHistoryStore();
    const { user } = useAuthStore();
    const [selectedSession, setSelectedSession] = useState(null);
    const [groupedSessions, setGroupedSessions] = useState({});

    const reportRef = useRef();

    useEffect(() => {
        setGroupedSessions(getSessionsByDate());
    }, [sessions]);

    const handleEventClick = (event) => {
        setSelectedSession(event);
    };

    const handleCloseModal = () => {
        setSelectedSession(null);
    };

    // Fallback if react-to-print is not installed (it wasn't in package.json)
    const handlePrintFallback = () => {
        const printContent = reportRef.current;
        const windowUrl = 'about:blank';
        const uniqueName = new Date();
        const windowName = 'Print' + uniqueName.getTime();
        const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Report</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            @page { size: A4; margin: 0; }
                            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
                        </style>
                    </head>
                    <body>
                        ${printContent.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        } else {
            alert('Please allow popups to print report');
        }
    };

    const groupRadius = selectedSession?.shots ? calculateGroupRadius(selectedSession.shots) : 0;
    const groupCenter = selectedSession?.shots ? calculateGroupCenter(selectedSession.shots) : null;

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-text mb-2">Events History</h1>
                <p className="text-dark-muted">View and analyze your past shooting sessions</p>
            </div>

            {Object.keys(groupedSessions).length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-dark-border">
                    <div className="text-6xl mb-6 flex justify-center text-dark-muted"><FaChartBar /></div>
                    <h2 className="text-2xl font-bold text-dark-text mb-2">No Sessions Yet</h2>
                    <p className="text-dark-muted max-w-md mx-auto">
                        Your saved shooting sessions will appear here. Start a new event to begin tracking your progress.
                    </p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(groupedSessions).map(([date, events]) => (
                        <div key={date} className="relative">
                            {/* Date Header as "Folder" label */}
                            <div className="flex items-center gap-4 mb-6 sticky top-20 z-10 bg-dark-bg/95 backdrop-blur-md py-4 rounded-xl border border-dark-border px-4 shadow-lg w-fit">
                                <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                                    <FaCalendarAlt size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-dark-text">{date}</h2>
                                <span className="bg-dark-elevated px-2 py-0.5 rounded text-xs text-dark-muted border border-dark-border">{events.length} sessions</span>
                            </div>

                            {/* Session Tiles Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-4 border-l-2 border-dark-border ml-4">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event)}
                                        className="btn-secondary group relative overflow-hidden p-0 rounded-2xl cursor-pointer hover:shadow-xl dark:hover:shadow-neon transition-all duration-300 h-full flex flex-col text-left"
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

                                            <h3 className="text-lg font-bold text-dark-text mb-1 truncate pr-2">
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
                        <div className="flex justify-end gap-3 sticky top-0 bg-dark-bg/95 py-2 z-10 border-b border-dark-border mb-4">
                            <button
                                onClick={handlePrintFallback}
                                className="btn btn-primary text-sm py-2 px-4 shadow-lg shadow-primary-500/20"
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

                        {/* Hidden Report Component for Printing */}
                        <div className="hidden">
                            <MatchReport
                                ref={reportRef}
                                session={selectedSession}
                                user={user}
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
