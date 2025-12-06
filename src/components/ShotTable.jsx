import React from 'react';

export default function ShotTable({ shots = [], totalScore = 0, totalScoreDecimal = 0 }) {
    return (
        <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-dark-elevated">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Shot</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Dir</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Score</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Sum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                        {shots.map((shot, index) => {
                            const cumulativeScore = shots.slice(0, index + 1).reduce((sum, s) => sum + s.score, 0);
                            const cumulativeScoreDecimal = shots.slice(0, index + 1).reduce((sum, s) => sum + s.scoreDecimal, 0);

                            return (
                                <tr
                                    key={shot.id || index}
                                    className={`hover:bg-dark-elevated transition-colors ${index === shots.length - 1 ? 'bg-primary-500/10' : ''
                                        }`}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-gray-200">
                                        {shot.number}
                                    </td>
                                    <td className="px-4 py-3 text-center text-lg">
                                        {shot.direction}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-semibold text-gray-200">
                                                {shot.score}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {shot.scoreDecimal?.toFixed(1)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-primary-400">
                                                {cumulativeScore}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {cumulativeScoreDecimal.toFixed(1)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-dark-elevated border-t-2 border-primary-500">
                        <tr>
                            <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-gray-300">
                                Total
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex flex-col items-end">
                                    <span className="text-lg font-bold text-primary-400">
                                        {totalScore}
                                    </span>
                                    <span className="text-sm text-gray-400">
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
