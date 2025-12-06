import { create } from 'zustand';

export const usePelletStore = create((set, get) => ({
    pellets: [],
    currentPellet: null,
    testShots: [],
    maxShots: 5,
    weaponType: 'pistol', // 'pistol' or 'rifle'

    startPelletTest: (pelletName, numShots, weaponType) => set({
        currentPellet: pelletName,
        maxShots: numShots,
        weaponType,
        testShots: [],
    }),

    addTestShot: (shotData) => set((state) => {
        if (state.testShots.length >= state.maxShots) {
            return state; // Don't add more shots than allowed
        }

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
            pelletName: state.currentPellet,
            weaponType: state.weaponType,
            shots: state.testShots,
            groupDiameter,
            timestamp: Date.now(),
        };

        set((state) => ({
            pellets: [...state.pellets, pelletResult],
            currentPellet: null,
            testShots: [],
        }));

        return pelletResult;
    },

    resetPelletTest: () => set({
        currentPellet: null,
        testShots: [],
        maxShots: 5,
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
