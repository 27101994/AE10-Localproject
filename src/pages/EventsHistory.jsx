import React, { useEffect, useState } from 'react';
import { useHistoryStore } from '@store/historyStore';
import DateGroup from '@components/DateGroup';
import Modal from '@components/Modal';
import TargetImage from '@components/TargetImage';
import ShotTable from '@components/ShotTable';
import { calculateGroupRadius, calculateGroupCenter } from '@utils/shootingUtils';
import { FaChartBar } from 'react-icons/fa';

export default function EventsHistory() {
    const { sessions, getSessionsByDate } = useHistoryStore();
    const [selectedSession, setSelectedSession] = useState(null);
    const [groupedSessions, setGroupedSessions] = useState({});

    useEffect(() => {
        setGroupedSessions(getSessionsByDate());
    }, [sessions]);

    const handleEventClick = (event) => {
        setSelectedSession(event);
    };

    const handleCloseModal = () => {
        setSelectedSession(null);
    };

    const groupRadius = selectedSession?.shots ? calculateGroupRadius(selectedSession.shots) : 0;
    const groupCenter = selectedSession?.shots ? calculateGroupCenter(selectedSession.shots) : null;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Events History</h1>
                <p className="text-gray-400">View your past shooting sessions</p>
            </div>

            {Object.keys(groupedSessions).length === 0 ? (
                <div className="card text-center py-16">
                    <div className="text-6xl mb-4 flex justify-center text-gray-500"><FaChartBar /></div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">No Sessions Yet</h2>
                    <p className="text-gray-500">
                        Your saved shooting sessions will appear here
                    </p>
                </div>
            ) : (
                <div>
                    {Object.entries(groupedSessions).map(([date, events]) => (
                        <DateGroup
                            key={date}
                            date={date}
                            events={events}
                            onEventClick={handleEventClick}
                        />
                    ))}
                </div>
            )}

            {/* Session Detail Modal */}
            {selectedSession && (
                <Modal isOpen={true} onClose={handleCloseModal} title={selectedSession.matchName}>
                    <div className="space-y-6">
                        {/* Session Info */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-dark-elevated rounded-lg p-4">
                                <div className="text-xs text-gray-500 mb-1">Total Shots</div>
                                <div className="text-2xl font-bold text-primary-400">
                                    {selectedSession.shots?.length || 0}
                                </div>
                            </div>
                            <div className="bg-dark-elevated rounded-lg p-4">
                                <div className="text-xs text-gray-500 mb-1">Score</div>
                                <div className="text-2xl font-bold text-accent-green">
                                    {selectedSession.totalScore || 0}
                                </div>
                            </div>
                            <div className="bg-dark-elevated rounded-lg p-4">
                                <div className="text-xs text-gray-500 mb-1">Decimal</div>
                                <div className="text-2xl font-bold text-accent-cyan">
                                    {selectedSession.totalScoreDecimal?.toFixed(1) || '0.0'}
                                </div>
                            </div>
                        </div>

                        {/* Target View */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-3">Target View</h3>
                            <TargetImage
                                shots={selectedSession.shots || []}
                                groupRadius={groupRadius}
                                groupCenter={groupCenter}
                                size={400}
                            />
                        </div>

                        {/* Shot Table */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-3">Shot Details</h3>
                            <div className="max-h-96 overflow-y-auto">
                                <ShotTable
                                    shots={selectedSession.shots || []}
                                    totalScore={selectedSession.totalScore || 0}
                                    totalScoreDecimal={selectedSession.totalScoreDecimal || 0}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
