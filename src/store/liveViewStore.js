import { create } from 'zustand';

export const useLiveViewStore = create((set, get) => ({
    viewSessions: [],
    currentViewCode: null,
    isHosting: false,

    // Create a new live view session
    createLiveView: () => {
        const code = generateViewCode();
        set({
            currentViewCode: code,
            isHosting: true,
        });
        return code;
    },

    // Join a live view session
    joinLiveView: (code) => {
        // In production, this would validate the code with backend
        set({
            currentViewCode: code,
            isHosting: false,
        });
        return true;
    },

    // End live view session
    endLiveView: () => set({
        currentViewCode: null,
        isHosting: false,
    }),
}));

// Generate a 6-character alphanumeric code
function generateViewCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
