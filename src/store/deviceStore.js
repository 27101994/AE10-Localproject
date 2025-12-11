import { create } from 'zustand';

export const useDeviceStore = create((set) => ({
    connectedDevice: null,
    availableDevices: [],
    brightness: 80, // Changed from 50 to 80 as per instruction
    bulletColor: 'cyan', // 'cyan', 'yellow', 'red'
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

    autoCalibrate: async () => {
        set({ isCalibrating: true });

        // Simulate calibration process
        await new Promise(resolve => setTimeout(resolve, 2000));

        set({ isCalibrating: false });
        return { success: true, message: 'Calibration completed successfully' };
    },
}));

