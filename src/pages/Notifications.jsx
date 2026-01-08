import React, { useMemo, useState } from 'react';
import { useNotificationStore } from '@store/notificationStore';
import { FaBell, FaTrophy, FaCog, FaBullseye, FaExclamationTriangle, FaCheckCircle, FaFilter, FaCaretDown } from 'react-icons/fa';

export default function Notifications() {
    const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
    const [filterType, setFilterType] = useState('all'); // all, unread, read

    // Get icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'achievement':
                return <FaTrophy className="text-yellow-400" />;
            case 'system':
                return <FaCog className="text-blue-400" />;
            case 'event':
                return <FaBullseye className="text-primary-500" />;
            case 'alert':
                return <FaExclamationTriangle className="text-orange-400" />;
            default:
                return <FaBell className="text-gray-400" />;
        }
    };

    // Get background color based on notification type
    const getNotificationBg = (type) => {
        switch (type) {
            case 'achievement':
                return 'bg-yellow-500/10 border-yellow-500/30';
            case 'system':
                return 'bg-blue-500/10 border-blue-500/30';
            case 'event':
                return 'bg-primary-500/10 border-primary-500/30';
            case 'alert':
                return 'bg-orange-500/10 border-orange-500/30';
            default:
                return 'bg-dark-elevated border-dark-border';
        }
    };

    // Filter notifications
    const filteredNotifications = useMemo(() => {
        switch (filterType) {
            case 'unread':
                return notifications.filter(n => !n.read);
            case 'read':
                return notifications.filter(n => n.read);
            default:
                return notifications;
        }
    }, [notifications, filterType]);

    // Group notifications by date
    const groupedNotifications = useMemo(() => {
        const grouped = {};

        filteredNotifications.forEach(notification => {
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
    }, [filteredNotifications]);

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-5xl mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-text mb-2 flex items-center gap-3">
                            <FaBell className="text-primary-500" />
                            Notifications
                        </h1>
                        <p className="text-dark-muted">
                            {unreadCount > 0
                                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                : 'You\'re all caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="btn btn-secondary text-sm flex items-center gap-2"
                        >
                            <FaCheckCircle />
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel p-4 mb-8 rounded-2xl border border-dark-border flex items-center gap-4 sticky top-4 z-20 backdrop-blur-xl bg-dark-bg/80 shadow-2xl">
                <FaFilter className="text-dark-muted" />
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterType === 'all'
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'text-dark-muted hover:text-dark-text hover:bg-dark-elevated'
                            }`}
                    >
                        All ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilterType('unread')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterType === 'unread'
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'text-dark-muted hover:text-dark-text hover:bg-dark-elevated'
                            }`}
                    >
                        Unread ({unreadCount})
                    </button>
                    <button
                        onClick={() => setFilterType('read')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterType === 'read'
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'text-dark-muted hover:text-dark-text hover:bg-dark-elevated'
                            }`}
                    >
                        Read ({notifications.length - unreadCount})
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            {Object.keys(groupedNotifications).length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-dark-border">
                    <div className="text-6xl mb-6 flex justify-center text-dark-muted">
                        <FaBell />
                    </div>
                    <h2 className="text-2xl font-bold text-dark-text mb-2">No Notifications</h2>
                    <p className="text-dark-muted max-w-md mx-auto">
                        {filterType === 'unread'
                            ? "You're all caught up! No unread notifications."
                            : filterType === 'read'
                                ? "No read notifications to display."
                                : "You don't have any notifications yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {Object.entries(groupedNotifications).map(([date, notifs]) => (
                        <div key={date} className="relative">
                            {/* Date Header */}
                            <div className="flex items-center gap-4 mb-6 sticky top-[5.5rem] z-10 bg-dark-bg/95 backdrop-blur-md py-4 rounded-xl border border-dark-border px-4 shadow-lg w-fit">
                                <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                                    <FaBell size={18} />
                                </div>
                                <h2 className="text-xl font-bold text-dark-text">{date}</h2>
                                <span className="bg-dark-elevated px-2 py-0.5 rounded text-xs text-dark-muted border border-dark-border">
                                    {notifs.length}
                                </span>
                            </div>

                            {/* Notification Cards */}
                            <div className="space-y-4">
                                {notifs.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-xl hover:scale-[1.01] ${getNotificationBg(notification.type)
                                            } ${!notification.read ? 'ring-2 ring-primary-500/30' : ''}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 text-3xl mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                                                        )}
                                                    </h3>
                                                    <span className="text-xs text-dark-muted font-mono whitespace-nowrap">
                                                        {new Date(notification.date).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-dark-muted text-sm leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs px-2 py-1 rounded-lg bg-dark-bg/50 text-dark-muted capitalize border border-dark-border">
                                                        {notification.type}
                                                    </span>
                                                    {notification.read && (
                                                        <span className="text-xs text-green-400 flex items-center gap-1">
                                                            <FaCheckCircle size={10} />
                                                            Read
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
