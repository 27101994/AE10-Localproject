import React from 'react';
import TargetImage from './TargetImage';
import Timer from './Timer';

export default function PlayerTile({ player }) {
    const { name, shots = [], currentShot = 0, groupRadius = 0, groupCenter = { x: 0, y: 0 }, startTime, isActive } = player;

    const totalScore = shots.reduce((sum, shot) => sum + shot.score, 0);
    const totalScoreDecimal = shots.reduce((sum, shot) => sum + shot.scoreDecimal, 0);

    return (
        <div className="card">
            {/* Player Name Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-border">
                <h3 className="text-lg font-bold text-gray-100">{name}</h3>
                {isActive && (
                    <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                )}
            </div>

            {/* Scaled-down Target View */}
            <div className="mb-4">
                <TargetImage
                    shots={shots}
                    groupRadius={groupRadius}
                    groupCenter={groupCenter}
                    size={200}
                />
            </div>

            {/* Player Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-dark-elevated rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">Shot</div>
                    <div className="text-lg font-bold text-primary-400">{currentShot}</div>
                </div>

                <div className="bg-dark-elevated rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">Timer</div>
                    <div className="text-sm font-mono text-gray-300">
                        <Timer startTime={startTime} isRunning={isActive} />
                    </div>
                </div>

                <div className="bg-dark-elevated rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">Score</div>
                    <div className="text-lg font-bold text-accent-green">{totalScore}</div>
                </div>

                <div className="bg-dark-elevated rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">Decimal</div>
                    <div className="text-lg font-bold text-accent-cyan">{totalScoreDecimal.toFixed(1)}</div>
                </div>

                <div className="bg-dark-elevated rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">Group Ø</div>
                    <div className="text-sm font-mono text-gray-300">{groupRadius}</div>
                </div>

                <div className="bg-dark-elevated rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">Center</div>
                    <div className="text-xs font-mono text-gray-400">
                        ({groupCenter.x.toFixed(1)}, {groupCenter.y.toFixed(1)})
                    </div>
                </div>
            </div>
        </div>
    );
}
