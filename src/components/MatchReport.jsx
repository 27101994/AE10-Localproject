import React, { forwardRef } from 'react';
import TargetImage from './TargetImage';
import ShotTable from './ShotTable';
import { calculateGroupRadius, calculateGroupCenter, formatTime } from '@utils/shootingUtils';

const MatchReport = forwardRef(({ session, user }, ref) => {
    if (!session) return null;

    const groupRadius = session.shots ? calculateGroupRadius(session.shots) : 0;
    const groupCenter = session.shots ? calculateGroupCenter(session.shots) : null;

    const getDirectionIcon = (dir) => {
        if (!dir) return '-';
        const arrows = {
            'UP': '↑', 'UP_RIGHT': '↗', 'RIGHT': '→', 'DOWN_RIGHT': '↘',
            'DOWN': '↓', 'DOWN_LEFT': '↙', 'LEFT': '←', 'UP_LEFT': '↖'
        };
        return arrows[dir] || dir;
    };

    // Helper to calculate series scores (group of 10 shots)
    const calculateSeries = () => {
        const series = [];
        const shots = session.shots || [];
        for (let i = 0; i < shots.length; i += 10) {
            const chunk = shots.slice(i, i + 10);
            const score = chunk.reduce((acc, s) => acc + s.score, 0);
            const decimal = chunk.reduce((acc, s) => acc + s.scoreDecimal, 0);

            // Calculate duration for this series
            let duration = 0;
            if (chunk.length > 1) {
                const startTime = new Date(chunk[0].timestamp).getTime();
                const endTime = new Date(chunk[chunk.length - 1].timestamp).getTime();
                duration = endTime - startTime;
            }

            series.push({
                id: Math.floor(i / 10) + 1,
                score,
                decimal,
                shots: chunk,
                duration: formatTime(duration)
            });
        }
        return series;
    };

    const seriesData = calculateSeries();

    return (
        <div ref={ref} className="bg-white text-black p-8 font-sans print:p-0 print:m-0 w-full max-w-[210mm] mx-auto min-h-[297mm]">
            {/* Header */}
            <div className="bg-[#1a2332] text-white p-4 rounded-t-lg mb-6 flex justify-between items-center print:bg-[#1a2332] print:text-white print:break-inside-avoid">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{user?.name || 'Shooter'}</h1>
                        <p className="text-sm text-gray-400">{session.matchName || 'Match'} | {session.eventType || 'Air Pistol'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8 print:gap-4">
                {/* Match Details */}
                <div>
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4">Match Details</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Type</span>
                            <span className="font-semibold">{session.matchName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date</span>
                            <span className="font-semibold">{new Date(session.savedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time</span>
                            <span className="font-semibold">{new Date(session.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-semibold">{formatDuration(session.duration || 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Score Summary */}
                <div>
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4">Score Summary</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-600">Total Score</span>
                            <div className="text-right">
                                <span className="text-xl font-bold block">{session.totalScoreDecimal?.toFixed(1)}</span>
                                <span className="text-xs text-gray-500">({session.totalScore})</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Inner Tens</span>
                            <span className="font-semibold">{session.innerTens || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shots</span>
                            <span className="font-semibold">{session.shots?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Average</span>
                            <span className="font-semibold">{session.averageScore?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Best Series</span>
                            <span className="font-semibold">{Math.max(...seriesData.map(s => s.decimal), 0).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Worst Series</span>
                            <span className="font-semibold">{seriesData.length ? Math.min(...seriesData.map(s => s.decimal)).toFixed(1) : '0.0'}</span>
                        </div>
                    </div>
                </div>

                {/* Match Configuration */}
                <div>
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4">Match Configuration</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Target Type</span>
                            <span className="font-semibold">{session.eventType?.includes('rifle') ? 'Air Rifle' : 'Air Pistol'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Distance</span>
                            <span className="font-semibold">10m</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Series View */}
            <div className="flex flex-col gap-6 mb-8 break-inside-avoid">
                {seriesData.map((series) => (
                    <div key={series.id} className="border border-gray-200 rounded p-6 break-inside-avoid bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-6 bg-[#1a2332] text-white p-3 rounded">
                            <div className="flex flex-col">
                                <span className="font-bold text-lg">Series {series.id}</span>
                                <span className="text-xs text-gray-400">Total Time: {series.duration}</span>
                            </div>
                            <span className="font-bold bg-white text-black px-3 py-1 rounded text-lg">{series.decimal.toFixed(1)}</span>
                        </div>
                        <div className="flex flex-row gap-8 items-start">
                            {/* Large Target Image */}
                            <div className="flex-shrink-0">
                                <TargetImage
                                    shots={series.shots}
                                    size={300}
                                    showControls={false}
                                    targetType={session.eventType?.toLowerCase().includes('rifle') ? 'rifle' : 'pistol'}
                                />
                            </div>

                            {/* Detailed Shot Table */}
                            <div className="flex-1">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="py-2 px-4 font-semibold text-gray-600">#</th>
                                            <th className="py-2 px-4 font-semibold text-gray-600">Dir</th>
                                            <th className="py-2 px-4 font-semibold text-gray-600">Score</th>
                                            <th className="py-2 px-4 font-semibold text-gray-600">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {series.shots.map((shot, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50">
                                                <td className="py-2 font-medium text-gray-500">{(series.id - 1) * 10 + idx + 1}</td>
                                                <td className="py-2 text-xl font-bold text-primary-600">{getDirectionIcon(shot.direction)}</td>
                                                <td className="py-2 font-mono font-bold text-lg text-[#1a2332]">{shot.scoreDecimal.toFixed(1)}</td>
                                                <td className="py-2 text-gray-400 text-xs font-mono">{new Date(shot.timestamp).toLocaleTimeString([], { second: '2-digit', fractionalSecondDigits: 2 }).split(' ')[0]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

function formatDuration(ms) {
    if (!ms) return '0h 0m 0s';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

export default MatchReport;
