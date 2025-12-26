import React, { useEffect, useRef } from 'react';


export default function ShotTable({ shots = [], totalScore = 0, totalScoreDecimal = 0, compact = false }) {
    const scrollRef = useRef(null);

    // Padding classes based on compact mode
    const tdClass = compact ? "px-3 py-2" : "px-6 py-4";
    const thClass = compact ? "px-3 py-2" : "px-6 py-4";

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
        <div className="flex flex-col h-full w-full bg-transparent">
            {/* Header */}
            <div className="bg-dark-elevated/50 border-b border-dark-border">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className={`${thClass} text-left text-sm font-bold text-dark-muted uppercase tracking-wider w-1/4`}>Shot</th>
                            <th className={`${thClass} text-center text-sm font-bold text-dark-muted uppercase tracking-wider w-1/4`}>Dir</th>
                            <th className={`${thClass} text-right text-sm font-bold text-dark-muted uppercase tracking-wider w-1/4`}>Score</th>
                            <th className={`${thClass} text-right text-sm font-bold text-dark-muted uppercase tracking-wider w-1/4`}>Sum</th>
                        </tr>
                    </thead>
                </table>
            </div>

            {/* Scrollable Body - Flexible height */}
            <div
                ref={scrollRef}
                className="overflow-y-auto flex-1 custom-scrollbar"
            >
                <table className="w-full">
                    <tbody className="divide-y divide-dark-border">
                        {shots.map((shot, index) => {
                            const cumulativeScore = shots.slice(0, index + 1).reduce((sum, s) => sum + s.score, 0);
                            const cumulativeScoreDecimal = shots.slice(0, index + 1).reduce((sum, s) => sum + s.scoreDecimal, 0);

                            // 10X logic
                            const displayScore = shot.scoreDecimal > 10.3 ? '10X' : shot.score;

                            return (
                                <tr
                                    key={shot.id || index}
                                    className={`hover:bg-dark-elevated/50 transition-colors ${index === shots.length - 1 ? 'bg-primary-500/10' : ''
                                        }`}
                                >
                                    <td className={`${tdClass} text-lg font-bold text-dark-text w-1/4`}>
                                        {shot.number}
                                    </td>
                                    <td className={`${tdClass} text-center text-xl font-bold text-primary-600 dark:text-accent-cyan w-1/4 flex justify-center items-center`}>
                                        {getDirectionIcon(shot.direction)}
                                    </td>
                                    <td className={`${tdClass} text-right w-1/4`}>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-bold text-dark-text">
                                                {displayScore}
                                            </span>
                                            <span className="text-sm font-medium text-dark-muted">
                                                {shot.scoreDecimal?.toFixed(1)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`${tdClass} text-right w-1/4`}>
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
                            <td className={`${tdClass} text-lg font-bold text-dark-text w-1/2`}>
                                Total
                            </td>
                            <td className={`${tdClass} text-right w-1/2`}>
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
