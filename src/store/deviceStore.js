import { create } from 'zustand';

export const useDeviceStore = create((set) => ({
    connectedDevice: null,
    availableDevices: [],
    brightness: 80, // Changed from 50 to 80 as per instruction
    bulletColor: 'cyan', // 'cyan', 'yellow', 'red' - kept for backward compatibility

    // Shot color configuration
    currentShotColor: 'cyan',
    previousShotColor: 'yellow',
    olderShotsColor: 'red',

    isConnected: false,
    isCalibrating: false,
    connectionType: 'usb', // USB connection as per user feedback

    // Mock available devices for demo
    discoverDevices: () => {
        // Mock discovery
        const mockDevices = [
            { id: '1', name: 'AET 05', serialNumber: 'SN-005-2024', type: 'usb' },
            { id: '2', name: 'AET 10', serialNumber: 'SN-010-2024', type: 'usb' },
            { id: '3', name: 'AET 25', serialNumber: 'SN-025-2024', type: 'usb' },
            { id: '4', name: 'AET 50', serialNumber: 'SN-050-2024', type: 'usb' },
        ];
        set({ availableDevices: mockDevices });
        return mockDevices;
    },

    setConnectedDevice: (device) => set({
        connectedDevice: device,
        isConnected: true
    }),

    disconnectDevice: () => set({
        connectedDevice: null,
        isConnected: false
    }),

    setAvailableDevices: (devices) => set({ availableDevices: devices }),

    setBrightness: (value) => set({ brightness: value }),

    setBulletColor: (color) => set({ bulletColor: color, currentShotColor: color }), // Also update currentShotColor for backward compatibility

    // Shot color setters
    setCurrentShotColor: (color) => set({ currentShotColor: color, bulletColor: color }), // Keep bulletColor in sync
    setPreviousShotColor: (color) => set({ previousShotColor: color }),
    setOlderShotsColor: (color) => set({ olderShotsColor: color }),

    autoCalibrate: async () => {
        set({ isCalibrating: true });

        // Simulate calibration process
        await new Promise(resolve => setTimeout(resolve, 2000));

        set({ isCalibrating: false });
        return { success: true, message: 'Calibration completed successfully' };
    },

    // Sensor data for hit projection visualization
    sensorData: {
        xAxis: Array.from({ length: 100 }, (_, i) => {
            const position = i + 1;
            let value = Math.floor(Math.random() * 200) + 850; // Base value around 850-1050

            // Simulate some dust/hits on specific sensors (red bars)
            if ([15, 28, 67, 89].includes(position)) {
                value = Math.floor(Math.random() * 400) + 1800; // Red - dust or hit
            } else if ([14, 16, 27, 29, 66, 68, 88, 90].includes(position)) {
                value = Math.floor(Math.random() * 200) + 1400; // Orange - adjacent
            }

            return { position, value };
        }),
        yAxis: Array.from({ length: 100 }, (_, i) => {
            const position = i + 1;
            let value = Math.floor(Math.random() * 200) + 850; // Base value around 850-1050

            // Simulate some dust/hits on specific sensors (red bars)
            if ([23, 45, 78].includes(position)) {
                value = Math.floor(Math.random() * 600) + 1800; // Red - dust or hit
            } else if ([22, 24, 44, 46, 77, 79].includes(position)) {
                value = Math.floor(Math.random() * 200) + 1400; // Orange - adjacent
            }

            return { position, value };
        }),
        hitPosition: { x: 75, y: 45 } // Mock hit position
    },

    // Generate mock sensor data with a hit
    generateSensorHit: (xPos = null, yPos = null) => set((state) => {
        const hitX = xPos || Math.floor(Math.random() * 100) + 1;
        const hitY = yPos || Math.floor(Math.random() * 100) + 1;

        const xAxis = Array.from({ length: 100 }, (_, i) => {
            const position = i + 1;
            let value = Math.floor(Math.random() * 200) + 850;

            // Highlight hit position and adjacent sensors
            if (position === hitX) {
                value = 2000; // Direct hit - red
            } else if (Math.abs(position - hitX) === 1) {
                value = 1400; // Adjacent - orange
            } else if (Math.abs(position - hitX) === 2) {
                value = 1200; // Near - yellow
            }

            return { position, value };
        });

        const yAxis = Array.from({ length: 100 }, (_, i) => {
            const position = i + 1;
            let value = Math.floor(Math.random() * 200) + 850;

            // Highlight hit position and adjacent sensors
            if (position === hitY) {
                value = 2400; // Direct hit - red
            } else if (Math.abs(position - hitY) === 1) {
                value = 2200; // Adjacent - orange
            } else if (Math.abs(position - hitY) === 2) {
                value = 1100; // Near - yellow
            }

            return { position, value };
        });

        return {
            sensorData: {
                xAxis,
                yAxis,
                hitPosition: { x: hitX, y: hitY }
            }
        };
    }),

    // Reset sensor data to baseline
    resetSensorData: () => set({
        sensorData: {
            xAxis: Array.from({ length: 100 }, (_, i) => ({
                position: i + 1,
                value: Math.floor(Math.random() * 200) + 850
            })),
            yAxis: Array.from({ length: 100 }, (_, i) => ({
                position: i + 1,
                value: Math.floor(Math.random() * 200) + 850
            })),
            hitPosition: null
        }
    }),
}));

