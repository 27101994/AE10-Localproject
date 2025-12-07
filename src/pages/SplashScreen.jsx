import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import athieonLogo from '../assets/athieon-logo.png';

export default function SplashScreen() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2 seconds
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2000);

        // Navigate after fade out completes
        const navTimer = setTimeout(() => {
            navigate('/login');
        }, 2500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(navTimer);
        };
    }, [navigate]);

    return (
        <div className={`fixed inset-0 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-center">
                {/* Company Logo Placeholder */}
                {/* Company Logo */}
                <div className="mb-8 animate-pulse">
                    <img
                        src={athieonLogo}
                        alt="Athieon Logo"
                        className="w-48 h-auto mx-auto object-contain drop-shadow-2xl"
                    />
                </div>

                <h1 className="text-4xl font-bold text-gradient mb-2">
                    Shooting Training System
                </h1>
                <p className="text-gray-400 text-lg">
                    Precision. Performance. Excellence.
                </p>
            </div>
        </div>
    );
}
