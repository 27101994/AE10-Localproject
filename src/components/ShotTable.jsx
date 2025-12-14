import React, { useEffect, useRef } from 'react';


export default function ShotTable({ shots = [], totalScore = 0, totalScoreDecimal = 0 }) {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom when shots change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [shots.length]);

    const getDirectionIcon = (dir) => {
        // console.log('Shot Direction:', dir); 
        if (!dir) return '-';

        let arrow = '';
        switch (dir) {
            case 'UP': arrow = '↑'; break;
            case 'UP_RIGHT': arrow = '↗'; break;
            case 'RIGHT': arrow = '→'; break;
            case 'DOWN_RIGHT': arrow = '↘'; break;
            case 'DOWN': arrow = '↓'; break;
            case 'DOWN_LEFT': arrow = '↙'; break;
            case 'LEFT': arrow = '←'; break;
            case 'UP_LEFT': arrow = '↖'; break;
            default: return dir;
        }

        return <span className="text-2xl font-bold font-sans">{arrow}</span>;
    };

    return (
        <div className="glass-panel rounded-xl border border-dark-border overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="bg-dark-elevated/50 border-b border-dark-border">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-dark-muted uppercase tracking-wider w-1/4">Shot</th>
                            <th className="px-6 py-4 text-center text-sm font-bold text-dark-muted uppercase tracking-wider w-1/4">Dir</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-dark-muted uppercase tracking-wider w-1/4">Score</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-dark-muted uppercase tracking-wider w-1/4">Sum</th>
                        </tr>
                    </thead>
                </table>
            </div>

            {/* Scrollable Body - Fixed height for approx 10 rows */}
            <div
                ref={scrollRef}
                className="overflow-y-auto flex-1 custom-scrollbar"
            >
                <table className="w-full">
                    <tbody className="divide-y divide-dark-border">
                        {shots.map((shot, index) => {
                            const cumulativeScore = shots.slice(0, index + 1).reduce((sum, s) => sum + s.score, 0);
                            const cumulativeScoreDecimal = shots.slice(0, index + 1).reduce((sum, s) => sum + s.scoreDecimal, 0);

                            // 10X logic: Score > 10.3 displayed as 10X (or check is10x flag if trustworthy)
                            // Client requirement: "10X shold be display for score >10.3"
                            const displayScore = shot.scoreDecimal > 10.3 ? '10X' : shot.score;

                            return (
                                <tr
                                    key={shot.id || index}
                                    className={`hover:bg-dark-elevated/50 transition-colors ${index === shots.length - 1 ? 'bg-primary-500/10' : ''
                                        }`}
                                >
                                    <td className="px-6 py-4 text-lg font-bold text-dark-text w-1/4">
                                        {shot.number}
                                    </td>
                                    <td className="px-6 py-4 text-center text-xl font-bold text-primary-600 dark:text-accent-cyan w-1/4 flex justify-center items-center">
                                        {getDirectionIcon(shot.direction)}
                                    </td>
                                    <td className="px-6 py-4 text-right w-1/4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-bold text-dark-text">
                                                {displayScore}
                                            </span>
                                            <span className="text-sm font-medium text-dark-muted">
                                                {shot.scoreDecimal?.toFixed(1)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right w-1/4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                                {cumulativeScore}
                                            </span>
                                            <span className="text-sm font-medium text-dark-muted">
                                                {cumulativeScoreDecimal.toFixed(1)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="bg-dark-elevated/50 border-t-2 border-primary-500">
                <table className="w-full">
                    <tfoot>
                        <tr>
                            <td className="px-6 py-4 text-lg font-bold text-dark-text w-1/2">
                                Total
                            </td>
                            <td className="px-6 py-4 text-right w-1/2">
                                <div className="flex flex-col items-end">
                                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {totalScore}
                                    </span>
                                    <span className="text-lg text-dark-muted font-medium">
                                        {totalScoreDecimal.toFixed(1)}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
