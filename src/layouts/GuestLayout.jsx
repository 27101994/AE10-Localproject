import React from 'react';
import { Outlet } from 'react-router-dom';
import athieonLogo from '@/assets/athieon-logo.png';

export default function GuestLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg bg-gradient-mesh p-4 relative overflow-hidden transition-colors duration-300">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10 animate-scale-in">
                {/* Logo and branding */}
                <div className="text-center mb-8">
                    {/* Athieon Logo - Inverted for dark theme */}
                    <div className="flex justify-center mb-6 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-500/20 blur-2xl rounded-full"></div>
                        <img
                            src={athieonLogo}
                            alt="Athieon Logo"
                            className="h-20 w-auto object-contain relative z-10 invert dark:invert-0 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Content */}
                <Outlet />
            </div>
        </div>
    );
}
