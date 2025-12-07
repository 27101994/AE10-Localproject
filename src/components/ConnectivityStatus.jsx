import React from 'react';
import { useDeviceStore } from '@store/deviceStore';

export default function ConnectivityStatus() {
    const { isConnected, connectedDevice } = useDeviceStore();

    return (
        <button
            className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg
                border transition-all duration-200
                ${isConnected
                    ? 'bg-accent-green/10 border-accent-green text-accent-green'
                    : 'bg-accent-red/10 border-accent-red text-accent-red'
                }
            `}
            title={isConnected ? `Connected: ${connectedDevice?.name || 'Device'}` : 'Not Connected'}
        >
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent-green' : 'bg-accent-red'} animate-pulse`} />
            <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
            </span>
        </button>
    );
}
