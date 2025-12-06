import React, { useState } from 'react';
import { useDeviceStore } from '@store/deviceStore';
import Button from '@components/Button';
import RangeSlider from '@components/RangeSlider';

export default function TargetSetup() {
    const {
        connectedDevice,
        availableDevices,
        brightness,
        isConnected,
        isCalibrating,
        discoverDevices,
        setConnectedDevice,
        disconnectDevice,
        setBrightness,
        autoCalibrate,
    } = useDeviceStore();

    const [scanning, setScanning] = useState(false);

    const handleScan = async () => {
        setScanning(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate scanning
        discoverDevices();
        setScanning(false);
    };

    const handleConnect = (device) => {
        setConnectedDevice(device);
    };

    const handleCalibrate = async () => {
        const result = await autoCalibrate();
        alert(result.message);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Target Setup</h1>
                <p className="text-gray-400">Configure and manage your target device</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Connected Device */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Connection Status */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Connection Status</h2>
                        {isConnected && connectedDevice ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-dark-elevated rounded-lg">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse"></div>
                                            <span className="text-lg font-bold text-gray-100">
                                                {connectedDevice.name}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Serial: {connectedDevice.serialNumber}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Connection: USB
                                        </p>
                                    </div>
                                    <Button variant="secondary" onClick={disconnectDevice}>
                                        Disconnect
                                    </Button>
                                </div>

                                {/* Brightness Control */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Light Intensity</h3>
                                    <RangeSlider
                                        value={brightness}
                                        onChange={setBrightness}
                                        min={0}
                                        max={100}
                                        label={`${brightness}%`}
                                    />
                                </div>

                                {/* Calibration */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Calibration</h3>
                                    <Button
                                        variant="primary"
                                        onClick={handleCalibrate}
                                        disabled={isCalibrating}
                                        className="w-full"
                                    >
                                        {isCalibrating ? '⏳ Calibrating...' : '🎯 Auto Calibrate'}
                                    </Button>
                                </div>

                                {/* Support */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Support</h3>
                                    <Button variant="secondary" className="w-full">
                                        📞 Contact Support
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔌</div>
                                <h3 className="text-xl font-bold text-gray-300 mb-2">No Device Connected</h3>
                                <p className="text-gray-500 mb-6">
                                    Scan for available devices to connect
                                </p>
                                <Button variant="primary" onClick={handleScan} disabled={scanning}>
                                    {scanning ? '🔍 Scanning...' : '🔍 Scan for Devices'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Available Devices */}
                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Available Devices</h2>

                        {availableDevices.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">
                                    No devices found. Click "Scan for Devices" to search.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {availableDevices.map((device) => (
                                    <div
                                        key={device.id}
                                        className="p-4 bg-dark-elevated rounded-lg hover:bg-dark-border transition-colors cursor-pointer"
                                        onClick={() => handleConnect(device)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-gray-100 mb-1">
                                                    {device.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {device.serialNumber}
                                                </div>
                                                <div className="text-xs text-primary-400 mt-1">
                                                    USB
                                                </div>
                                            </div>
                                            <div className="text-2xl">🎯</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
