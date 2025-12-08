import React from 'react';
import { Outlet } from 'react-router-dom';
import athieonLogo from '@/assets/athieon-logo.png';
import { getTagline } from '@/config/appConfig';

export default function GuestLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg p-4">
            <div className="w-full max-w-md">
                {/* Logo and branding */}
                <div className="text-center mb-8">
                    {/* Athieon Logo - Inverted for dark theme */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={athieonLogo}
                            alt="Athieon"
                            className="h-13 w-auto"
                            style={{ filter: 'invert(1) brightness(2)', mixBlendMode: 'screen' }}
                        />
                    </div>

                    {/* Product Model */}
                    <p className="text-primary-400 font-medium">{getTagline()}</p>
                </div>

                {/* Content */}
                <Outlet />
            </div>
        </div>
    );
}
