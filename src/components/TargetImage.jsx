import React from 'react';

export default function TargetImage({ shots = [], groupRadius, groupCenter, size = 400, showSighterIndicator = false }) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Target ring radii (as percentages of size)
    const rings = [
        { radius: 0.05, score: '10x', color: '#fbbf24' },
        { radius: 0.15, score: '10', color: '#fff' },
        { radius: 0.30, score: '9', color: '#fff' },
        { radius: 0.45, score: '8', color: '#fff' },
    ];

    return (
        <div className="relative bg-dark-bg rounded-xl p-4">
            {/* Sighter Mode Indicator - Grey Triangle in top-right */}
            {showSighterIndicator && (
                <div className="absolute top-6 right-6 z-10">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <polygon
                            points="20,5 35,35 5,35"
                            fill="#6b7280"
                            stroke="#9ca3af"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            )}

            <svg width={size} height={size} className="mx-auto">
                {/* Dark background circle */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={size * 0.48}
                    fill="#0a0e1a"
                    stroke="#2a3142"
                    strokeWidth="2"
                />

                {/* Target rings */}
                {rings.map((ring, index) => (
                    <g key={index}>
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r={size * ring.radius}
                            fill="none"
                            stroke={ring.color}
                            strokeWidth="2"
                        />

                        {/* Score labels at cardinal directions */}
                        {index > 0 && (
                            <>
                                <text
                                    x={centerX + size * (ring.radius + rings[index - 1].radius) / 2}
                                    y={centerY}
                                    fill="#fff"
                                    fontSize="24"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {ring.score}
                                </text>
                                <text
                                    x={centerX - size * (ring.radius + rings[index - 1].radius) / 2}
                                    y={centerY}
                                    fill="#fff"
                                    fontSize="24"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {ring.score}
                                </text>
                                <text
                                    x={centerX}
                                    y={centerY - size * (ring.radius + rings[index - 1].radius) / 2}
                                    fill="#fff"
                                    fontSize="24"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {ring.score}
                                </text>
                                <text
                                    x={centerX}
                                    y={centerY + size * (ring.radius + rings[index - 1].radius) / 2}
                                    fill="#fff"
                                    fontSize="24"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {ring.score}
                                </text>
                            </>
                        )}
                    </g>
                ))}

                {/* Group radius circle */}
                {groupRadius > 0 && groupCenter && (
                    <circle
                        cx={centerX + groupCenter.x}
                        cy={centerY - groupCenter.y}
                        r={groupRadius}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                    />
                )}

                {/* Group center marker */}
                {groupCenter && (
                    <g>
                        <line
                            x1={centerX + groupCenter.x - 10}
                            y1={centerY - groupCenter.y}
                            x2={centerX + groupCenter.x + 10}
                            y2={centerY - groupCenter.y}
                            stroke="#10b981"
                            strokeWidth="2"
                        />
                        <line
                            x1={centerX + groupCenter.x}
                            y1={centerY - groupCenter.y - 10}
                            x2={centerX + groupCenter.x}
                            y2={centerY - groupCenter.y + 10}
                            stroke="#10b981"
                            strokeWidth="2"
                        />
                    </g>
                )}

                {/* Shot markers */}
                {shots.map((shot, index) => {
                    const isLast = index === shots.length - 1;
                    const isPrevious = index === shots.length - 2;

                    let color = '#06b6d4'; // Cyan for regular shots
                    if (isLast) color = '#fbbf24'; // Yellow for last shot
                    else if (isPrevious) color = '#3b82f6'; // Blue for previous shot

                    return (
                        <g key={shot.id || index}>
                            {/* Shot marker circle */}
                            <circle
                                cx={centerX + shot.x}
                                cy={centerY - shot.y}
                                r="8"
                                fill={color}
                                stroke="#fff"
                                strokeWidth="2"
                                className="transition-all duration-300"
                            />

                            {/* Shot number */}
                            <text
                                x={centerX + shot.x}
                                y={centerY - shot.y}
                                fill="#000"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {shot.number}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
