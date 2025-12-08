import React from 'react';

import { FaCircle } from 'react-icons/fa';

export default function DeviceStatusBadge({ isConnected, deviceName }) {
    return (
        <div className="flex items-center space-x-2">
            {/* Status indicator with pulse animation when connected */}
            <div className={`w-2 h-2 rounded-full ${isConnected
                ? 'bg-accent-green animate-pulse-slow shadow-lg shadow-green-500/50'
                : 'bg-gray-500'
                }`}
            />

            {/* Device info */}
            <div className="text-sm">
                <span className={`font-medium ${isConnected ? 'text-accent-green' : 'text-gray-400'
                    } transition-colors`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {isConnected && deviceName && (
                    <span className="text-gray-500 ml-1 flex items-center gap-1"><FaCircle size={6} /> {deviceName}</span>
                )}
            </div>
        </div>
    );
}
