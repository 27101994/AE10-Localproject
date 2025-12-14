import React, { forwardRef } from 'react';
import TargetImage from './TargetImage';
import ShotTable from './ShotTable';

const MatchReport = forwardRef(({ session, user }, ref) => {
    if (!session) return null;

    const groupRadius = session.shots ? calculateGroupRadius(session.shots) : 0;
    const groupCenter = session.shots ? calculateGroupCenter(session.shots) : null;

    // Helper to calculate series scores (group of 10 shots)
    const calculateSeries = () => {
        const series = [];
        const shots = session.shots || [];
        for (let i = 0; i < shots.length; i += 10) {
            const chunk = shots.slice(i, i + 10);
            const score = chunk.reduce((acc, s) => acc + s.score, 0);
            const decimal = chunk.reduce((acc, s) => acc + s.scoreDecimal, 0);
            series.push({ id: Math.floor(i / 10) + 1, score, decimal, shots: chunk });
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
            <div className="grid grid-cols-2 gap-8 mb-8 break-inside-avoid">
                {seriesData.map((series) => (
                    <div key={series.id} className="border border-gray-200 rounded p-4 break-inside-avoid">
                        <div className="flex justify-between items-center mb-4 bg-[#1a2332] text-white p-2 rounded">
                            <span className="font-bold">Series {series.id}</span>
                            <span className="font-bold bg-white text-black px-2 rounded">{series.decimal.toFixed(1)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square relative border rounded-full border-gray-200 flex items-center justify-center overflow-hidden">
                                <TargetImage
                                    shots={series.shots}
                                    size={300}
                                    showControls={false}
                                    simpleView={true} // Add simpleView prop to TargetImage to remove minimal details for print
                                />
                            </div>
                            <div>
                                <table className="w-full text-xs text-center">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="py-1">#</th>
                                            <th>Score</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {series.shots.map((shot, idx) => (
                                            <tr key={idx} className="border-b border-gray-100">
                                                <td className="py-1">{(series.id - 1) * 10 + idx + 1}</td>
                                                <td className="font-mono font-bold">{shot.scoreDecimal.toFixed(1)}</td>
                                                <td className="text-gray-500 text-[10px]">{new Date(shot.timestamp).toLocaleTimeString([], { second: '2-digit', fractionalSecondDigits: 2 }).split(' ')[0]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Biometric Statistics Placeholder */}
            <div className="mt-8 break-inside-avoid">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4">Biometric Statistics</h2>
                <div className="text-gray-500 italic text-sm text-center py-4">
                    Biometric data not available for this session.
                </div>
            </div>

        </div>
    );
});

// Utils needed within component or imported
function calculateGroupRadius(shots) {
    // Simplified placeholder; real implementation in shootingUtils
    return 0;
}
function calculateGroupCenter(shots) {
    return { x: 0, y: 0 };
}
function formatDuration(ms) {
    if (!ms) return '0h 0m 0s';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

export default MatchReport;
