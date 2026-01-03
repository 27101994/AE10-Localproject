import { useDeviceStore } from '@store/deviceStore'; // Import store

export default function TargetImage(props) {
    const { shots = [], groupRadius, groupCenter, size = 400, showSighterIndicator = false, simpleMode = false, simpleView = false, targetType = 'pistol', zoom = 1 } = props;

    // Use either simpleMode or simpleView
    const isSimple = simpleMode || simpleView;
    const { bulletColor } = useDeviceStore(); // Get preferred color
    const centerX = size / 2;
    const centerY = size / 2;

    // Map color names to hex/rgba values
    const getColor = (baseColor) => {
        const colors = {
            cyan: '#06b6d4',
            yellow: '#facc15',
            red: '#ef4444',
            blue: '#3b82f6'
        };
        return colors[baseColor] || colors.cyan;
    };

    const activeColor = getColor(bulletColor || 'cyan');

    // ISSF 10m Target Specifications
    const getRings = (type) => {
        if (type === 'rifle') {
            // ISSF 10m Air Rifle
            // 1-3 White, 4-10 Black
            const maxDia = 45.5;
            return [
                { score: '1', radius: 45.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '2', radius: 40.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '3', radius: 35.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '4', radius: 30.5 / maxDia / 2, color: 'black', text: 'white', stroke: 'none' }, // Black starts
                { score: '5', radius: 25.5 / maxDia / 2, color: 'none', stroke: 'white', isZone: true, text: 'white' },
                { score: '6', radius: 20.5 / maxDia / 2, color: 'none', stroke: 'white', isZone: true, text: 'white' },
                { score: '7', radius: 15.5 / maxDia / 2, color: 'none', stroke: 'white', isZone: true, text: 'white' },
                { score: '8', radius: 10.5 / maxDia / 2, color: 'none', stroke: 'white', isZone: true, text: 'white' },
                { score: '9', radius: 5.5 / maxDia / 2, color: 'none', stroke: 'white', isZone: true }, // No text for 9 usually
                { score: '10', radius: 0.5 / maxDia / 2, color: 'white', stroke: 'none', isDot: true }, // Inner dot
            ];
        } else {
            // ISSF 10m Air Pistol (Default)
            // 1-6 White, 7-10 Black
            const maxDia = 155.5;
            return [
                { score: '1', radius: 155.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '2', radius: 139.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '3', radius: 123.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '4', radius: 107.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '5', radius: 91.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '6', radius: 75.5 / maxDia / 2, color: 'white', text: 'black', stroke: 'black' },
                { score: '7', radius: 59.5 / maxDia / 2, color: 'black', text: 'white', stroke: 'none' }, // Black starts
                { score: '8', radius: 43.5 / maxDia / 2, color: 'none', stroke: 'white', isZone: true, text: 'white' },
                { score: '9', radius: 27.5 / maxDia / 2, color: 'none', stroke: 'white', isZone: true },
                { score: '10', radius: 11.5 / maxDia / 2, color: 'none', stroke: 'white', isZone: true },
                { score: 'X', radius: 5.0 / maxDia / 2, color: 'none', stroke: 'white', dashed: false, isInnerTen: true }, // Inner ten
            ];
        }
    };

    const rings = getRings(targetType);

    if (isSimple) {
        return (
            <div className="relative bg-white rounded-xl p-4 overflow-hidden border-4 border-black flex items-center justify-center">
                <svg width={size} height={size} className="mx-auto">
                    {/* Simple Mode: Single Black Circle */}
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r={size * 0.2}
                        fill="black"
                        stroke="none"
                    />

                    {/* Red dot if shot recorded (showing last shot or just a dot if any shots exist) */}
                    {shots.length > 0 && (
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r={size * 0.05}
                            fill="red"
                            className="animate-pulse"
                        />
                    )}
                </svg>
            </div>
        );
    }

    return (
        <div className="relative bg-white overflow-hidden shadow-2xl flex items-center justify-center w-full h-full" style={{ aspectRatio: '1/1' }}>
            <svg
                viewBox={`0 0 ${size} ${size}`}
                className="w-full h-full"
            >
                {/* Target Background - Paper Color (White) */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={size * 0.48}
                    fill="white"
                    stroke="#000"
                    strokeWidth="1"
                />

                {/* Target rings */}
                {rings.map((ring, index) => (
                    <g key={index}>
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r={size * ring.radius}
                            fill={ring.color === 'none' ? 'none' : ring.color}
                            stroke={ring.stroke || 'black'}
                            strokeWidth="1"
                            strokeDasharray={ring.dashed ? "3,3" : ""}
                        />

                        {/* Score labels at cardinal directions */}
                        {ring.text && !ring.isDot && !ring.isInnerTen && (
                            <>
                                <text x={centerX} y={centerY - size * ring.radius + (ring.score >= 7 || (ring.score === '4' && targetType === 'rifle') ? 15 : 20)} fill={ring.text} fontSize="14" fontWeight="bold" textAnchor="middle">{ring.score}</text>
                                <text x={centerX} y={centerY + size * ring.radius - (ring.score >= 7 || (ring.score === '4' && targetType === 'rifle') ? 5 : 10)} fill={ring.text} fontSize="14" fontWeight="bold" textAnchor="middle">{ring.score}</text>
                                <text x={centerX - size * ring.radius + (ring.score >= 7 || (ring.score === '4' && targetType === 'rifle') ? 15 : 20)} y={centerY} fill={ring.text} fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{ring.score}</text>
                                <text x={centerX + size * ring.radius - (ring.score >= 7 || (ring.score === '4' && targetType === 'rifle') ? 15 : 20)} y={centerY} fill={ring.text} fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{ring.score}</text>
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

                    // Lighter colors for older shots
                    let color = activeColor;
                    let opacity = 0.4;
                    let textColor = 'rgba(0,0,0,0.5)';

                    if (isLast) {
                        color = '#fbbf24'; // Yellow solid for last shot ALWAYS
                        opacity = 1;
                        textColor = '#000';
                    }
                    else if (isPrevious) {
                        opacity = 0.7;
                        textColor = '#000';
                    }

                    return (
                        <g key={shot.id || index}>
                            {/* Shot marker circle - NO WHITE BORDER */}
                            <circle
                                cx={centerX + shot.x}
                                cy={centerY - shot.y}
                                r="8"
                                fill={color}
                                fillOpacity={opacity}
                                stroke="none"
                                className="transition-all duration-300"
                            />

                            {/* Shot number */}
                            <text
                                x={centerX + shot.x}
                                y={centerY - shot.y}
                                fill={textColor}
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
