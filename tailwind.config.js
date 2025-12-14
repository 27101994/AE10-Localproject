/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // FutureTech Dark Theme (Now Dynamic)
                dark: {
                    bg: 'rgb(var(--color-dark-bg) / <alpha-value>)',
                    surface: 'rgb(var(--color-dark-surface) / <alpha-value>)',
                    elevated: 'rgb(var(--color-dark-elevated) / <alpha-value>)',
                    border: 'rgb(var(--color-dark-border) / <alpha-value>)',     // Subtle glass border
                    text: 'rgb(var(--color-dark-text) / <alpha-value>)',
                    muted: 'rgb(var(--color-dark-muted) / <alpha-value>)',
                },
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9', // Electric Sky Blue
                    600: '#0284c7', // Vivid Blue
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                accent: {
                    cyan: '#22d3ee',   // Neon Cyan
                    purple: '#a855f7', // Neon Purple
                    pink: '#ec4899',   // Neon Pink
                    yellow: '#facc15', // Neon Yellow
                    screen: '#10b981', // Neon Green
                },
                status: {
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    info: '#3b82f6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'], // Added Outfit for modern feel if available
            },
            backgroundImage: {
                'gradient-mesh': 'radial-gradient(circle at 15% 50%, rgba(14, 165, 233, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.08), transparent 25%)',
                'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            },
            boxShadow: {
                'neon': '0 0 5px theme("colors.primary.500"), 0 0 20px theme("colors.primary.500")',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-hover': '0 0 20px rgba(14, 165, 233, 0.3)',
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}
