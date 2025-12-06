import { create } from 'zustand';
import { useHistoryStore } from './historyStore';

export const useLiveStore = create((set, get) => ({
    shots: [],
    currentShot: 0,
    matchName: '',
    startTime: null,
    isRunning: false,
    series: 1,
    mode: 'sighter', // 'sighter' or 'match'
    sighterShots: [],

    // Add a new shot
    addShot: (shotData) => set((state) => {
        const newShot = {
            id: state.shots.length + 1,
            number: state.shots.length + 1,
            x: shotData.x,
            y: shotData.y,
            score: shotData.score,
            scoreDecimal: shotData.scoreDecimal,
            direction: shotData.direction,
            timestamp: Date.now(),
            series: state.series,
            mode: state.mode,
        };

        // If in sighter mode, add to sighter shots
        if (state.mode === 'sighter') {
            return {
                sighterShots: [...state.sighterShots, newShot],
                currentShot: state.currentShot + 1,
            };
        }

        // If in match mode, add to regular shots
        return {
            shots: [...state.shots, newShot],
            currentShot: state.currentShot + 1,
        };
    }),

    // Toggle between sighter and match mode
    toggleMode: () => set((state) => ({
        mode: state.mode === 'sighter' ? 'match' : 'sighter',
    })),

    // Set mode explicitly
    setMode: (mode) => set({ mode }),

    // Start the session
    startSession: (matchName, mode = 'sighter') => set({
        matchName,
        startTime: Date.now(),
        isRunning: true,
        shots: [],
        sighterShots: [],
        currentShot: 0,
        mode,
    }),

    // Stop the session
    stopSession: () => set({ isRunning: false }),

    // Save the session
    saveSession: () => {
        const state = get();
        const session = {
            matchName: state.matchName,
            shots: state.shots,
            sighterShots: state.sighterShots,
            startTime: state.startTime,
            endTime: Date.now(),
            totalScore: state.shots.reduce((sum, shot) => sum + shot.score, 0),
            totalScoreDecimal: state.shots.reduce((sum, shot) => sum + shot.scoreDecimal, 0),
        };

        // Save to history store
        useHistoryStore.getState().addSession(session);

        return session;
    },

    // Reset the session
    resetSession: () => set({
        shots: [],
        sighterShots: [],
        currentShot: 0,
        matchName: '',
        startTime: null,
        isRunning: false,
        series: 1,
        mode: 'sighter',
    }),

    // Get total scores (match shots only)
    getTotalScore: () => {
        const state = get();
        return state.shots.reduce((sum, shot) => sum + shot.score, 0);
    },

    getTotalScoreDecimal: () => {
        const state = get();
        return state.shots.reduce((sum, shot) => sum + shot.scoreDecimal, 0);
    },

    // Get all shots (sighter + match)
    getAllShots: () => {
        const state = get();
        return [...state.sighterShots, ...state.shots];
    },
}));

