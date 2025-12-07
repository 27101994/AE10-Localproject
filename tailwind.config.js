/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark theme colors
                dark: {
                    bg: '#0f1419',
                    surface: '#1a1f2e',
                    elevated: '#252b3b',
                    border: '#3d4556',
                },
                primary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                accent: {
                    cyan: '#14b8a6',
                    yellow: '#f59e0b',
                    green: '#22c55e',
                    red: '#ef4444',
                    teal: '#14b8a6',
                },
                score: {
                    10: '#f59e0b', // Yellow for 10x
                    9: '#14b8a6',  // Teal for 9
                    8: '#64748b',  // Gray for 8
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
