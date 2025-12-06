import React from 'react';
import { Outlet } from 'react-router-dom';

export default function GuestLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg p-4">
            <div className="w-full max-w-md">
                {/* Logo placeholder */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gradient">AET10</h1>
                    <p className="text-gray-400 mt-2">Shooting Training System</p>
                </div>

                {/* Content */}
                <Outlet />
            </div>
        </div>
    );
}
