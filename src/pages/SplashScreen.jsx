import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import athieonLogo from '../assets/athieon-logo.png';

export default function SplashScreen() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Enforce dark mode for splash screen
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');

        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 3500); // Extended to let animations play out

        const navTimer = setTimeout(() => {
            navigate('/login');
        }, 4000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(navTimer);
        };
    }, [navigate]);

    return (
        <div className={`fixed inset-0 bg-slate-50 dark:bg-dark-bg bg-gradient-mesh flex items-center justify-center transition-colors duration-500 z-50 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {/* Screen Flash */}
            <div className="absolute inset-0 bg-white pointer-events-none animate-flash z-50 mix-blend-overlay"></div>

            {/* Background Glows */}
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary-500/20 dark:bg-primary-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>

            <div className="text-center relative z-10 flex flex-col items-center">
                {/* Company Logo - SLAM Animation */}
                <div className="relative mb-8 animate-slam">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-500/30 blur-3xl rounded-full"></div>
                    <img
                        src={athieonLogo}
                        alt="Athieon"
                        className="h-[160px] w-auto relative z-10 drop-shadow-[0_0_25px_rgba(14,165,233,0.6)] invert dark:invert-0 transition-all duration-500"
                    />
                </div>

                {/* Text - Slide Up with Delay */}
                <div className="overflow-hidden">
                    <h1
                        className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-primary-600 to-primary-500 dark:from-white dark:via-primary-200 dark:to-primary-400 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-lg animate-slide-up-fade opacity-0"
                        style={{ animationDelay: '0.6s' }}
                    >
                        Shooting Training System
                    </h1>
                </div>

                <div className="overflow-hidden">
                    <p
                        className="text-primary-700 dark:text-primary-300/80 text-xl font-light tracking-widest uppercase animate-slide-up-fade opacity-0"
                        style={{ animationDelay: '0.8s' }}
                    >
                        Track, Analyze and Perfect Your Game
                    </p>
                </div>
            </div>
        </div>
    );
}
