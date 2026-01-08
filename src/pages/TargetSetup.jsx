import React, { useState } from 'react';
import { useDeviceStore } from '@store/deviceStore';
import Button from '@components/Button';
import RangeSlider from '@components/RangeSlider';
import SensorView from '@components/SensorView';
import { FaPhone, FaPlug, FaSearch, FaBullseye, FaSpinner, FaPalette, FaSun, FaLink } from 'react-icons/fa';

export default function TargetSetup() {
    const {
        connectedDevice,
        availableDevices,
        brightness,
        currentShotColor,
        previousShotColor,
        olderShotsColor,
        isConnected,
        isCalibrating,
        sensorData,
        discoverDevices,
        setConnectedDevice,
        disconnectDevice,
        setBrightness,
        setCurrentShotColor,
        setPreviousShotColor,
        setOlderShotsColor,
        autoCalibrate,
        resetSensorData,
    } = useDeviceStore();

    const [scanning, setScanning] = useState(false);

    // Available colors
    const availableColors = [
        { name: 'Cyan', value: 'cyan', bg: 'bg-cyan-500' },
        { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-400' },
        { name: 'Red', value: 'red', bg: 'bg-red-500' },
        { name: 'Green', value: 'green', bg: 'bg-green-500' },
        { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
        { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
    ];

    // Handle color changes - directly update store
    const handleColorChange = (type, color) => {
        if (type === 'current') setCurrentShotColor(color);
        else if (type === 'previous') setPreviousShotColor(color);
        else if (type === 'older') setOlderShotsColor(color);
    };

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
                <h1 className="text-3xl font-bold text-dark-text mb-2">Target Setup</h1>
                <p className="text-dark-muted">Configure your shooting experience and target hardware</p>
            </div>

            {/* 3 Main Tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* 1. Brightness */}
                <div className="glass-card p-6 flex flex-col justify-between hover:border-yellow-500 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-500">
                            <FaSun className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg text-dark-text">Brightness</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-dark-muted">
                            <span>Adjust Intensity</span>
                            <span className="text-yellow-500 font-bold">{brightness}%</span>
                        </div>
                        <RangeSlider
                            value={brightness}
                            onChange={setBrightness}
                            min={0}
                            max={100}
                        />
                    </div>
                </div>

                {/* 2. Calibration */}
                <div className="glass-card p-6 flex flex-col justify-between hover:border-accent-green transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-green-500/20 text-accent-green">
                            <FaBullseye className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg text-dark-text">Calibration</h3>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm text-dark-muted">Calibrate sensors</p>
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

                {/* 3. Connect Device */}
                <div className="glass-card p-6 flex flex-col justify-between hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/20 text-blue-500">
                            <FaLink className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg text-dark-text">Connectivity</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-dark-bg/50 p-2 rounded-lg border border-dark-border">
                            <span className="text-sm text-dark-muted">{isConnected ? 'Connected' : 'Disconnected'}</span>
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

            {/* Shot Colors Configuration Table */}
            <div className="glass-panel p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-dark-text">Shot Colors Configuration</h2>
                        <p className="text-dark-muted text-sm mt-1">Configure different colors for shot indicators</p>
                    </div>
                    <div className="text-xs text-dark-muted bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30">
                        ✓ Changes are saved automatically
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border">
                                <th className="text-left py-4 px-4 text-dark-text font-bold">Shot Type</th>
                                <th className="text-left py-4 px-4 text-dark-text font-bold">Color Selection</th>
                                <th className="text-left py-4 px-4 text-dark-text font-bold">Preview</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Current Shot */}
                            <tr className="border-b border-dark-border/50 hover:bg-dark-elevated/50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="font-semibold text-dark-text">Current Shot</div>
                                    <div className="text-xs text-dark-muted mt-1">Most recent shot marker</div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => handleColorChange('current', color.value)}
                                                className={`w-10 h-10 rounded-full ${color.bg} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-elevated transition-all ${currentShotColor === color.value
                                                    ? 'ring-primary-500 scale-110 shadow-lg'
                                                    : 'ring-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className={`w-16 h-16 rounded-full ${availableColors.find(c => c.value === currentShotColor)?.bg} shadow-lg`}></div>
                                </td>
                            </tr>

                            {/* Previous Shot */}
                            <tr className="border-b border-dark-border/50 hover:bg-dark-elevated/50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="font-semibold text-dark-text">Previous Shot</div>
                                    <div className="text-xs text-dark-muted mt-1">Second-to-last shot marker</div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => handleColorChange('previous', color.value)}
                                                className={`w-10 h-10 rounded-full ${color.bg} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-elevated transition-all ${previousShotColor === color.value
                                                    ? 'ring-primary-500 scale-110 shadow-lg'
                                                    : 'ring-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className={`w-16 h-16 rounded-full ${availableColors.find(c => c.value === previousShotColor)?.bg} shadow-lg`}></div>
                                </td>
                            </tr>

                            {/* Older Shots */}
                            <tr className="hover:bg-dark-elevated/50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="font-semibold text-dark-text">Older Shots</div>
                                    <div className="text-xs text-dark-muted mt-1">All shots before the previous</div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => handleColorChange('older', color.value)}
                                                className={`w-10 h-10 rounded-full ${color.bg} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-elevated transition-all ${olderShotsColor === color.value
                                                    ? 'ring-primary-500 scale-110 shadow-lg'
                                                    : 'ring-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className={`w-16 h-16 rounded-full ${availableColors.find(c => c.value === olderShotsColor)?.bg} shadow-lg`}></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Device Listing & Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Available Devices List */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Available Devices</h2>
                    <div className="space-y-3 min-h-[200px]">
                        {scanning ? (
                            <div className="flex flex-col items-center justify-center h-40 text-dark-muted">
                                <FaSpinner className="animate-spin text-3xl mb-3 text-primary-500" />
                                Searching for targets...
                            </div>
                        ) : availableDevices.length > 0 ? (
                            availableDevices.map((device) => (
                                <div
                                    key={device.id}
                                    className={`p-4 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${connectedDevice?.id === device.id
                                        ? 'bg-primary-500/10 border-primary-500'
                                        : 'bg-dark-elevated border-transparent hover:border-dark-border'
                                        }`}
                                    onClick={() => !connectedDevice && handleConnect(device)}
                                >
                                    <div>
                                        <div className="font-bold text-dark-text">{device.name}</div>
                                        <div className="text-xs text-dark-muted">SN: {device.serialNumber}</div>
                                    </div>
                                    {connectedDevice?.id === device.id ? (
                                        <span className="text-accent-green font-bold text-sm bg-accent-green/10 px-2 py-1 rounded">ACTIVE</span>
                                    ) : (
                                        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleConnect(device); }}>Connect</Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-dark-muted border-2 border-dashed border-dark-border rounded-lg">
                                <FaSearch className="text-3xl mb-3 opacity-50" />
                                No devices found
                            </div>
                        )}
                    </div>
                </div>

                {/* Hardware Info / Console */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-bold text-dark-text mb-4">System Information</h2>
                    {connectedDevice ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-dark-elevated p-3 rounded-lg">
                                    <div className="text-xs text-dark-muted uppercase">Model</div>
                                    <div className="text-dark-text font-bold text-lg">{connectedDevice.name}</div>
                                </div>
                                <div className="bg-dark-elevated p-3 rounded-lg">
                                    <div className="text-xs text-dark-muted uppercase">Status</div>
                                    <div className="text-accent-green font-bold text-lg">Operational</div>
                                </div>
                                <div className="bg-dark-elevated p-3 rounded-lg">
                                    <div className="text-xs text-dark-muted uppercase">Firmware</div>
                                    <div className="text-dark-text font-bold text-lg">v2.4.1</div>
                                </div>
                                <div className="bg-dark-elevated p-3 rounded-lg">
                                    <div className="text-xs text-dark-muted uppercase">Latency</div>
                                    <div className="text-dark-text font-bold text-lg">4ms</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-dark-muted">
                            Connect a device to view hardware details
                        </div>
                    )}
                </div>
            </div>

            {/* Sensor View Section */}
            <div className="mt-8">
                <SensorView
                    sensorData={sensorData}
                    onReset={resetSensorData}
                />
            </div>
        </div>
    );
}
