import React from 'react';
import { usePerformanceStore } from '@store/performanceStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Dropdown from '@components/Dropdown';
import GaugeChart from '@components/GaugeChart';

export default function Performance() {
    const {
        selectedEvent,
        timeFrame,
        scoreHistory,
        shotsHistory,
        seriesTimeHistory,
        setSelectedEvent,
        setTimeFrame,
        getConsistency,
        getDailyAverageScore,
        getAvgTimePerSession,
    } = usePerformanceStore();

    const eventOptions = [
        { value: '10m-pistol', label: '10m Air Pistol' },
        { value: '10m-rifle', label: '10m Air Rifle' },
    ];

    const timeFrameOptions = [
        { value: '7days', label: 'Last 7 Days' },
        { value: '30days', label: 'Last 30 Days' },
        { value: '90days', label: 'Last 90 Days' },
        { value: 'all', label: 'All Time' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Performance Analytics</h1>
                <p className="text-gray-400">Track your progress and improve your skills</p>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Event Type
                        </label>
                        <Dropdown
                            options={eventOptions}
                            value={selectedEvent}
                            onChange={setSelectedEvent}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time Frame
                        </label>
                        <Dropdown
                            options={timeFrameOptions}
                            value={timeFrame}
                            onChange={setTimeFrame}
                        />
                    </div>
                </div>
            </div>

            {/* Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Consistency</h3>
                    <GaugeChart value={getConsistency()} max={100} label="%" />
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Daily Avg Score</h3>
                    <GaugeChart value={parseFloat(getDailyAverageScore())} max={600} label="" />
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Avg Time/Session</h3>
                    <GaugeChart value={getAvgTimePerSession()} max={300} label="sec" />
                </div>
            </div>

            {/* Score vs Day Graph */}
            <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Score vs Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={scoreHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3142' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Score" />
                        <Line type="monotone" dataKey="scoreDecimal" stroke="#06b6d4" strokeWidth={2} name="Decimal Score" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Shots vs Day Graph */}
            <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Number of Shots vs Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={shotsHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3142' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="shots" stroke="#10b981" strokeWidth={2} name="Shots" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Time per Series Graph */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Time for 1 Series vs Series</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={seriesTimeHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
                        <XAxis dataKey="series" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3142' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="time" stroke="#f59e0b" strokeWidth={2} name="Time (seconds)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
