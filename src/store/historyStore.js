import { create } from 'zustand';

export const useHistoryStore = create((set, get) => ({
    sessions: [],
    
    // Add a new session to history
    addSession: (session) => set((state) => ({
        sessions: [
            {
                ...session,
                id: Date.now(),
                savedAt: new Date().toISOString(),
            },
            ...state.sessions
        ]
    })),
    
    // Get sessions grouped by date
    getSessionsByDate: () => {
        const sessions = get().sessions;
        const grouped = {};
        
        sessions.forEach(session => {
            const date = new Date(session.savedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(session);
        });
        
        return grouped;
    },
    
    // Get session by ID
    getSessionById: (id) => {
        return get().sessions.find(session => session.id === id);
    },
    
    // Delete session
    deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter(session => session.id !== id)
    })),
    
    // Clear all sessions
    clearHistory: () => set({ sessions: [] }),
}));
