import React from 'react';
import Timer from './Timer';

export default function BuddyTile({ participant }) {
    const { name, shots = [], currentShot, groupRadius, groupCenter } = participant;

    const totalScore = shots.reduce((sum, shot) => sum + shot.score, 0);
    const totalScoreDecimal = shots.reduce((sum, shot) => sum + shot.scoreDecimal, 0);

    return (
        <div className="card">
            {/* Name header */}
            <div className="bg-primary-600 -mx-6 -mt-6 px-6 py-3 mb-4 rounded-t-xl">
                <h3 className="text-lg font-semibold text-white">{name}</h3>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-xs text-gray-500 mb-1">Shot Number</div>
                    <div className="text-2xl font-bold text-primary-400">{currentShot || 0}</div>
                </div>

                <div>
                    <div className="text-xs text-gray-500 mb-1">Score</div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-200">{totalScore}</span>
                        <span className="text-sm text-gray-500">{totalScoreDecimal.toFixed(1)}</span>
                    </div>
                </div>

                <div>
                    <div className="text-xs text-gray-500 mb-1">Group Radius</div>
                    <div className="text-lg font-semibold text-accent-green">{groupRadius || '0.00'}</div>
                </div>

                <div>
                    <div className="text-xs text-gray-500 mb-1">Group Centre</div>
                    <div className="text-sm text-gray-400">
                        {groupCenter ? `(${groupCenter.x.toFixed(1)}, ${groupCenter.y.toFixed(1)})` : '(0, 0)'}
                    </div>
                </div>
            </div>

            {/* Timer */}
            <div className="mt-4 pt-4 border-t border-dark-border">
                <div className="text-xs text-gray-500 mb-1">Time</div>
                <Timer startTime={participant.startTime} isRunning={participant.isRunning} />
            </div>
        </div>
    );
}
