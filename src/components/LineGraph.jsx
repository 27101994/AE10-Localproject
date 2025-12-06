import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function LineGraph({ data, xKey, yKey, title, color = '#0ea5e9' }) {
    return (
        <div className="card">
            {title && (
                <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
            )}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
                    <XAxis
                        dataKey={xKey}
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e2330',
                            border: '1px solid #2a3142',
                            borderRadius: '8px',
                            color: '#f3f4f6'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ color: '#9ca3af' }}
                    />
                    <Line
                        type="monotone"
                        dataKey={yKey}
                        stroke={color}
                        strokeWidth={2}
                        dot={{ fill: color, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
