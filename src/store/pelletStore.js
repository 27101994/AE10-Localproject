import { create } from 'zustand';

export const usePelletStore = create((set, get) => ({
    pellets: [],
    currentPellet: null, // This effectively acts as pelletName in the active test
    currentTestConfig: null, // Store full config
    testShots: [],
    // maxShots removed for unlimited shots requirement

    startPelletTest: (config) => set({
        currentPellet: config.pelletName,
        currentTestConfig: config,
        testShots: [],
    }),

    addTestShot: (shotData) => set((state) => {
        // Unlimited shots allowed
        return {
            testShots: [...state.testShots, {
                id: state.testShots.length + 1,
                x: shotData.x,
                y: shotData.y,
                score: shotData.score,
            }],
        };
    }),

    savePelletTest: () => {
        const state = get();
        const groupDiameter = calculateGroupDiameter(state.testShots);

        const pelletResult = {
            ...state.currentTestConfig,
            shots: state.testShots,
            groupDiameter,
            timestamp: Date.now(),
        };

        set((state) => ({
            pellets: [...state.pellets, pelletResult],
            currentPellet: null,
            currentTestConfig: null,
            testShots: [],
        }));

        return pelletResult;
    },

    resetPelletTest: () => set({
        currentPellet: null,
        currentTestConfig: null,
        testShots: [],
    }),
}));

// Helper function to calculate group diameter
function calculateGroupDiameter(shots) {
    if (shots.length < 2) return 0;

    let maxDistance = 0;
    for (let i = 0; i < shots.length; i++) {
        for (let j = i + 1; j < shots.length; j++) {
            const distance = Math.sqrt(
                Math.pow(shots[i].x - shots[j].x, 2) +
                Math.pow(shots[i].y - shots[j].y, 2)
            );
            maxDistance = Math.max(maxDistance, distance);
        }
    }

    return maxDistance.toFixed(2);
}
