import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import athieonLogo from '../assets/athieon-logo.png';

export default function SplashScreen() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2000);

        const navTimer = setTimeout(() => {
            navigate('/login');
        }, 2500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(navTimer);
        };
    }, [navigate]);

    return (
        <div className={`fixed inset-0 bg-dark-bg bg-gradient-mesh flex items-center justify-center transition-opacity duration-500 z-50 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {/* Background Glows */}
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>

            <div className="text-center relative z-10">
                {/* Company Logo */}
                <div className="flex items-center justify-center mb-6 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary-500/20 blur-3xl rounded-full"></div>
                    <img
                        src={athieonLogo}
                        alt="Athieon"
                        className="h-[140px] w-auto animate-fade-in-up mix-blend-screen delay-100 relative z-10"
                    />
                </div>

                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-lg">
                    Shooting Training System
                </h1>
                <p className="text-primary-300/80 text-xl font-light tracking-widest uppercase">
                    Track, Analyze and Perfect Your Game
                </p>
            </div>
        </div>
    );
}
