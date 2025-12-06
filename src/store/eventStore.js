import { create } from 'zustand';

// Event types from Excel requirements
export const EVENT_TYPES = [
    { id: '10m-pistol-60', name: '10m Air Pistol (60 shots)', shots: 60, type: 'pistol' },
    { id: '10m-rifle-60', name: '10m Air Rifle (60 shots)', shots: 60, type: 'rifle' },
    { id: '10m-pistol-40', name: '10m Air Pistol (40 shots)', shots: 40, type: 'pistol' },
    { id: '10m-rifle-40', name: '10m Air Rifle (40 shots)', shots: 40, type: 'rifle' },
    { id: '10m-pistol-free', name: '10m Air Pistol (Free series)', shots: null, type: 'pistol' },
    { id: '10m-rifle-free', name: '10m Air Rifle (Free series)', shots: null, type: 'rifle' },
];

export const useEventStore = create((set) => ({
    selectedEvent: null,
    eventType: null, // '10m-pistol-60', '10m-rifle-60', etc.
    eventMode: 'sighter', // 'match' or 'sighter'

    setEvent: (eventType) => {
        const event = EVENT_TYPES.find(e => e.id === eventType);
        set({
            selectedEvent: event,
            eventType
        });
    },

    setEventMode: (mode) => set({ eventMode: mode }),

    clearEvent: () => set({
        selectedEvent: null,
        eventType: null,
        eventMode: 'sighter'
    }),
}));

