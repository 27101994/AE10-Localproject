import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function GaugeChart({ value, max = 100, title, color = '#0ea5e9' }) {
    const percentage = (value / max) * 100;

    const data = [
        { name: 'Value', value: percentage },
        { name: 'Remaining', value: 100 - percentage }
    ];

    const COLORS = [color, '#1e2330'];

    return (
        <div className="card flex flex-col items-center">
            {title && (
                <h3 className="text-lg font-semibold text-gray-200 mb-2">{title}</h3>
            )}
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
                <div className="text-3xl font-bold text-primary-400">
                    {value.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">
                    out of {max}
                </div>
            </div>
        </div>
    );
}
