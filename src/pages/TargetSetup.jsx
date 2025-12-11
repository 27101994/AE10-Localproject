import React, { useState } from 'react';
import { useDeviceStore } from '@store/deviceStore';
import Button from '@components/Button';
import RangeSlider from '@components/RangeSlider';
import { FaPhone, FaPlug, FaSearch, FaBullseye, FaSpinner, FaPalette, FaSun, FaLink } from 'react-icons/fa';

export default function TargetSetup() {
    const {
        connectedDevice,
        availableDevices,
        brightness,
        bulletColor,
        isConnected,
        isCalibrating,
        discoverDevices,
        setConnectedDevice,
        disconnectDevice,
        setBrightness,
        setBulletColor,
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
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Target Setup</h1>
                <p className="text-gray-400">Configure your shooting experience and target hardware</p>
            </div>

            {/* 4 Main Tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 1. Bullet Color */}
                <div className="card-elevated flex flex-col justify-between hover:border-primary-500 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-pink-500/20 text-pink-400">
                            <FaPalette className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Bullet Color</h3>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-400">Select shot marker color</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setBulletColor('cyan')}
                                className={`w-10 h-10 rounded-full bg-cyan-500 ring-2 ring-offset-2 ring-offset-dark-elevated transition-all ${bulletColor === 'cyan' ? 'ring-white scale-110 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'ring-transparent opacity-60 hover:opacity-100'}`}
                            />
                            <button
                                onClick={() => setBulletColor('yellow')}
                                className={`w-10 h-10 rounded-full bg-yellow-400 ring-2 ring-offset-2 ring-offset-dark-elevated transition-all ${bulletColor === 'yellow' ? 'ring-white scale-110 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'ring-transparent opacity-60 hover:opacity-100'}`}
                            />
                            <button
                                onClick={() => setBulletColor('red')}
                                className={`w-10 h-10 rounded-full bg-red-500 ring-2 ring-offset-2 ring-offset-dark-elevated transition-all ${bulletColor === 'red' ? 'ring-white scale-110 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'ring-transparent opacity-60 hover:opacity-100'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Brightness */}
                <div className="card-elevated flex flex-col justify-between hover:border-yellow-500 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
                            <FaSun className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Brightness</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Adjust Intensity</span>
                            <span className="text-yellow-400 font-bold">{brightness}%</span>
                        </div>
                        <RangeSlider
                            value={brightness}
                            onChange={setBrightness}
                            min={0}
                            max={100}
                        />
                    </div>
                </div>

                {/* 3. Calibration */}
                <div className="card-elevated flex flex-col justify-between hover:border-accent-green transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-green-500/20 text-accent-green">
                            <FaBullseye className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Calibration</h3>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-400">Calibrate sensors</p>
                        <Button
                            variant="primary"
                            onClick={handleCalibrate}
                            disabled={isCalibrating || !isConnected}
                            className={`w-full ${!isConnected ? 'opacity-50' : ''}`}
                        >
                            {isCalibrating ? <span className="flex items-center justify-center gap-2"><FaSpinner className="animate-spin" /> ...</span> : 'Auto Calibrate'}
                        </Button>
                    </div>
                </div>

                {/* 4. Connect Device */}
                <div className="card-elevated flex flex-col justify-between hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                            <FaLink className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Connectivity</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-dark-bg p-2 rounded-lg border border-dark-border">
                            <span className="text-sm text-gray-400">{isConnected ? 'Connected' : 'Disconnected'}</span>
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-accent-green animate-pulse' : 'bg-red-500'}`}></div>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={isConnected ? disconnectDevice : handleScan}
                            className="w-full"
                        >
                            {isConnected ? 'Disconnect' : (scanning ? 'Scanning...' : 'Scan / Connect')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Device Listing & Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Available Devices List */}
                <div className="card">
                    <h2 className="text-xl font-bold text-white mb-4">Available Devices</h2>
                    <div className="space-y-3 min-h-[200px]">
                        {scanning ? (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                <FaSpinner className="animate-spin text-3xl mb-3 text-primary-500" />
                                Searching for targets...
                            </div>
                        ) : availableDevices.length > 0 ? (
                            availableDevices.map((device) => (
                                <div
                                    key={device.id}
                                    className={`p-4 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${connectedDevice?.id === device.id
                                            ? 'bg-primary-500/10 border-primary-500'
                                            : 'bg-dark-elevated border-transparent hover:border-gray-500'
                                        }`}
                                    onClick={() => !connectedDevice && handleConnect(device)}
                                >
                                    <div>
                                        <div className="font-bold text-white">{device.name}</div>
                                        <div className="text-xs text-gray-500">SN: {device.serialNumber}</div>
                                    </div>
                                    {connectedDevice?.id === device.id ? (
                                        <span className="text-accent-green font-bold text-sm bg-accent-green/10 px-2 py-1 rounded">ACTIVE</span>
                                    ) : (
                                        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleConnect(device); }}>Connect</Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500 border-2 border-dashed border-dark-border rounded-lg">
                                <FaSearch className="text-3xl mb-3 opacity-50" />
                                No devices found
                            </div>
                        )}
                    </div>
                </div>

                {/* Hardware Info / Console */}
                <div className="card">
                    <h2 className="text-xl font-bold text-white mb-4">System Information</h2>
                    {connectedDevice ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-dark-elevated p-3 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Model</div>
                                    <div className="text-white font-bold text-lg">{connectedDevice.name}</div>
                                </div>
                                <div className="bg-dark-elevated p-3 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Status</div>
                                    <div className="text-accent-green font-bold text-lg">Operational</div>
                                </div>
                                <div className="bg-dark-elevated p-3 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Firmware</div>
                                    <div className="text-white font-bold text-lg">v2.4.1</div>
                                </div>
                                <div className="bg-dark-elevated p-3 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Latency</div>
                                    <div className="text-white font-bold text-lg">4ms</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-gray-500">
                            Connect a device to view hardware details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
