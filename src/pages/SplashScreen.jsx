import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                <div className="mb-8 animate-pulse">
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary-500 to-accent-cyan rounded-3xl flex items-center justify-center shadow-2xl">
                        <div className="text-6xl font-bold text-white">AET10</div>
                    </div>
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
