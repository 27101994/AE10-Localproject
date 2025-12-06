import React from 'react';

export default function DeviceStatusBadge({ isConnected, deviceName }) {
    return (
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isConnected
                ? 'bg-accent-green/20 text-accent-green'
                : 'bg-gray-700/50 text-gray-400'
            }`}>
            {/* Status indicator */}
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent-green animate-pulse' : 'bg-gray-500'
                }`} />

            {/* Device name or status */}
            <span className="text-sm font-medium">
                {isConnected ? deviceName : 'No device connected'}
            </span>
        </div>
    );
}
