import { create } from 'zustand';

export const usePerformanceStore = create((set, get) => ({
    selectedEvent: '10m-pistol',
    timeFrame: '30days',

    // Mock performance data
    scoreHistory: [
        { date: '2024-11-27', score: 575, scoreDecimal: 575.3 },
        { date: '2024-11-28', score: 580, scoreDecimal: 580.7 },
        { date: '2024-11-29', score: 578, scoreDecimal: 578.2 },
        { date: '2024-11-30', score: 582, scoreDecimal: 582.5 },
        { date: '2024-12-01', score: 585, scoreDecimal: 585.1 },
        { date: '2024-12-02', score: 583, scoreDecimal: 583.8 },
        { date: '2024-12-03', score: 587, scoreDecimal: 587.4 },
        { date: '2024-12-04', score: 590, scoreDecimal: 590.2 },
    ],

    shotsHistory: [
        { date: '2024-11-27', shots: 60 },
        { date: '2024-11-28', shots: 60 },
        { date: '2024-11-29', shots: 40 },
        { date: '2024-11-30', shots: 60 },
        { date: '2024-12-01', shots: 60 },
        { date: '2024-12-02', shots: 60 },
        { date: '2024-12-03', shots: 40 },
        { date: '2024-12-04', shots: 60 },
    ],

    seriesTimeHistory: [
        { series: 1, time: 185 },
        { series: 2, time: 178 },
        { series: 3, time: 182 },
        { series: 4, time: 175 },
        { series: 5, time: 180 },
        { series: 6, time: 172 },
    ],

    setSelectedEvent: (event) => set({ selectedEvent: event }),
    setTimeFrame: (timeFrame) => set({ timeFrame }),

    // Calculate metrics
    getConsistency: () => {
        const scores = get().scoreHistory.map(s => s.score);
        if (scores.length === 0) return 0;

        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);

        // Convert to percentage (lower std dev = higher consistency)
        const consistency = Math.max(0, 100 - (stdDev / mean * 100));
        return Math.round(consistency);
    },

    getDailyAverageScore: () => {
        const scores = get().scoreHistory.map(s => s.scoreDecimal);
        if (scores.length === 0) return 0;

        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg.toFixed(1);
    },

    getAvgTimePerSession: () => {
        const times = get().seriesTimeHistory.map(s => s.time);
        if (times.length === 0) return 0;

        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        return Math.round(avg);
    },
}));
