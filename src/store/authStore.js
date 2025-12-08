import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
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
        }),
        {
            name: 'auth-storage', // unique name
            storage: createJSONStorage(() => sessionStorage), // Use sessionStorage to persist across reloads but clear on close, or localStorage to keep it. "Redirect to login on reload" implies they want it to persist. sessionStorage is enough for reload. Let's use sessionStorage to be safe for a "kiosk" style or shared device, unless requested otherwise. Actually, typical web apps use localStorage or cookies. Let's use localStorage for better UX.
            // changing to localStorage to match typical "remember me" behavior and robustness against tab closes.
            storage: createJSONStorage(() => localStorage),
        }
    )
);
