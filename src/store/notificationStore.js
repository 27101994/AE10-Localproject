import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
    notifications: [
        {
            id: 1,
            type: 'achievement',
            title: 'New Personal Best!',
            message: 'You scored 98.5 in 10m Air Pistol - your highest score yet!',
            date: new Date('2026-01-08T10:30:00').toISOString(),
            read: false
        },
        {
            id: 2,
            type: 'system',
            title: 'Target Setup Updated',
            message: 'Shot colors configuration has been saved successfully.',
            date: new Date('2026-01-08T09:15:00').toISOString(),
            read: false
        },
        {
            id: 3,
            type: 'event',
            title: 'Training Session Completed',
            message: 'Your morning practice session has been saved to history.',
            date: new Date('2026-01-08T08:45:00').toISOString(),
            read: true
        },
        {
            id: 4,
            type: 'alert',
            title: 'Device Connection',
            message: 'Target device successfully connected and calibrated.',
            date: new Date('2026-01-07T18:20:00').toISOString(),
            read: true
        },
        {
            id: 5,
            type: 'achievement',
            title: 'Consistency Streak',
            message: '7 days of training completed! Keep up the great work.',
            date: new Date('2026-01-07T17:00:00').toISOString(),
            read: true
        },
        {
            id: 6,
            type: 'event',
            title: 'Competition Reminder',
            message: 'Upcoming competition on January 15th - Practice mode available.',
            date: new Date('2026-01-06T14:30:00').toISOString(),
            read: true
        },
        {
            id: 7,
            type: 'system',
            title: 'Software Update',
            message: 'New features available: Shot color customization and improved analytics.',
            date: new Date('2026-01-06T10:00:00').toISOString(),
            read: true
        },
        {
            id: 8,
            type: 'achievement',
            title: 'First 10-Shot Group',
            message: 'You completed your first 10-shot group with an average score of 9.2!',
            date: new Date('2026-01-05T16:45:00').toISOString(),
            read: true
        },
        {
            id: 9,
            type: 'alert',
            title: 'Calibration Required',
            message: 'Your target device may need recalibration for optimal accuracy.',
            date: new Date('2026-01-05T12:15:00').toISOString(),
            read: true
        },
        {
            id: 10,
            type: 'event',
            title: 'Training Buddy Invite',
            message: 'John invited you to a training session. Check Train with Buddy.',
            date: new Date('2026-01-04T11:30:00').toISOString(),
            read: true
        }
    ],

    // Get all notifications
    getAllNotifications: () => get().notifications,

    // Get notifications grouped by date
    getNotificationsByDate: () => {
        const notifications = get().notifications;
        const grouped = {};

        notifications.forEach(notification => {
            const date = new Date(notification.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(notification);
        });

        return grouped;
    },

    // Get unread count
    getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
    },

    // Mark notification as read
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
    })),

    // Mark all as read
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),

    // Add new notification
    addNotification: (notification) => set((state) => ({
        notifications: [
            {
                ...notification,
                id: Date.now(),
                date: new Date().toISOString(),
                read: false
            },
            ...state.notifications
        ]
    })),

    // Delete notification
    deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),

    // Clear all notifications
    clearAll: () => set({ notifications: [] })
}));
