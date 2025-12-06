import { create } from 'zustand';

export const useDeviceStore = create((set) => ({
    connectedDevice: null,
    availableDevices: [],
    brightness: 50,
    isConnected: false,
    isCalibrating: false,
    connectionType: 'usb', // USB connection as per user feedback

    // Mock available devices for demo
    discoverDevices: () => {
        const mockDevices = [
            { id: 'dev-001', name: 'AET10 Target #1', serialNumber: 'SN-2024-001', type: 'usb' },
            { id: 'dev-002', name: 'AET10 Target #2', serialNumber: 'SN-2024-002', type: 'usb' },
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

