import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isGuest: false,

    login: (userData) => set({
        user: userData,
        isAuthenticated: true,
        isGuest: false
    }),

    loginAsGuest: () => set({
        user: { name: 'Guest', id: 'guest' },
        isAuthenticated: true,
        isGuest: true
    }),

    logout: () => set({
        user: null,
        isAuthenticated: false,
        isGuest: false
    }),
}));
