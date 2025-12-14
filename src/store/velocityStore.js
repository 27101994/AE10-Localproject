import { create } from 'zustand';

export const useVelocityStore = create((set, get) => ({
    measurements: [],
    currentMeasurement: null,
    isActive: false,

    // Start a new velocity measurement
    startMeasurement: (weaponName, pelletUsed, pelletWeight, caliber, place) => set({
        currentMeasurement: {
            weaponName,
            pelletUsed,
            pelletWeight,
            caliber,
            place,
            serialNumber: `VM-${Date.now()}`,
            date: new Date().toISOString(),
            shots: [],
        },
        isActive: true,
    }),

    // Add a shot velocity
    addShot: (velocity) => set((state) => {
        if (!state.currentMeasurement) return state;

        const updatedShots = [...state.currentMeasurement.shots, velocity];

        return {
            currentMeasurement: {
                ...state.currentMeasurement,
                shots: updatedShots,
            }
        };
    }),

    // Complete measurement and save
    completeMeasurement: () => set((state) => {
        if (!state.currentMeasurement) return state;

        const shots = state.currentMeasurement.shots;
        const average = shots.reduce((a, b) => a + b, 0) / shots.length;

        const completedMeasurement = {
            ...state.currentMeasurement,
            average: average.toFixed(2),
            completedAt: new Date().toISOString(),
        };

        return {
            measurements: [completedMeasurement, ...state.measurements],
            currentMeasurement: null,
            isActive: false,
        };
    }),

    // Cancel current measurement
    cancelMeasurement: () => set({
        currentMeasurement: null,
        isActive: false,
    }),

    // Get measurement by serial number
    getMeasurementBySerial: (serialNumber) => {
        return get().measurements.find(m => m.serialNumber === serialNumber);
    },
}));
