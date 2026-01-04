import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { FaChartBar, FaRedo } from 'react-icons/fa';
import Button from '@components/Button';

export default function SensorView({ sensorData, onReset }) {
    // Function to determine bar color based on value
    // Red indicates both direct hits and dust on sensors (high ADC readings)
    const getBarColor = (value) => {
        if (value >= 1800) return '#ef4444'; // Red - direct hit or dust
        if (value >= 1400) return '#f97316'; // Orange - adjacent
        if (value >= 1200) return '#facc15'; // Yellow - near
        return '#06b6d4'; // Cyan - normal
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-lg">
                    <p className="text-dark-muted text-xs">Position: {payload[0].payload.position}</p>
                    <p className="text-dark-text font-bold">ADC: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    const hasHit = sensorData?.hitPosition !== null;

    return (
        <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary-500/20 text-primary-500">
                        <FaChartBar className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-dark-text">Sensor View</h2>
                        <p className="text-sm text-dark-muted">Real-time hit projection analysis</p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    onClick={onReset}
                    className="flex items-center gap-2"
                >
                    <FaRedo className="text-sm" />
                    Reset Both
                </Button>
            </div>

            {/* Status Indicator */}
            {!hasHit && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
                    <span className="text-accent-green font-medium text-sm">Ready for next shot</span>
                </div>
            )}

            <div className="space-y-8">
                {/* X-Axis Hit Projection */}
                <div className="glass-card p-4">
                    <h3 className="text-lg font-bold text-dark-text mb-4 text-center">
                        X-AXIS HIT PROJECTION
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sensorData?.xAxis || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
                            <XAxis
                                dataKey="position"
                                stroke="#9ca3af"
                                style={{ fontSize: '10px' }}
                                interval={9}
                                label={{ value: 'Physical Position Left → Right (mm)', position: 'insideBottom', offset: -5, fill: '#9ca3af', fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                                label={{ value: 'ADC Peak', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {sensorData?.xAxis?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Y-Axis Hit Projection */}
                <div className="glass-card p-4">
                    <h3 className="text-lg font-bold text-dark-text mb-4 text-center">
                        Y-AXIS HIT PROJECTION
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sensorData?.yAxis || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
                            <XAxis
                                dataKey="position"
                                stroke="#9ca3af"
                                style={{ fontSize: '10px' }}
                                interval={9}
                                label={{ value: 'Physical Position Left → Right (mm)', position: 'insideBottom', offset: -5, fill: '#9ca3af', fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                                label={{ value: 'ADC Peak', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {sensorData?.yAxis?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-cyan-500"></div>
                    <span className="text-dark-muted">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-400"></div>
                    <span className="text-dark-muted">Near</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                    <span className="text-dark-muted">Adjacent</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-dark-muted">Hit / Dust</span>
                </div>
            </div>
        </div>
    );
}
