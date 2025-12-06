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
                    bg: '#0a0e1a',
                    surface: '#141824',
                    elevated: '#1e2330',
                    border: '#2a3142',
                },
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                accent: {
                    cyan: '#06b6d4',
                    yellow: '#fbbf24',
                    green: '#10b981',
                    red: '#ef4444',
                },
                score: {
                    10: '#fbbf24', // Yellow for 10x
                    9: '#06b6d4',  // Cyan for 9
                    8: '#3b82f6',  // Blue for 8
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
