import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useDeviceStore } from '@store/deviceStore';
import DeviceStatusBadge from '@components/DeviceStatusBadge';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isConnected, connectedDevice } = useDeviceStore();
        const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        // { path: '/start-event', label: 'Start Event', icon: '🎯' },
        // { path: '/live', label: 'Live', icon: '🔴' },
        // { path: '/events-history', label: 'History', icon: '📊' },
        // { path: '/train-buddy', label: 'Train Buddy', icon: '👥' },
        // { path: '/performance', label: 'Performance', icon: '📈' },
        // { path: '/velocity-meter', label: 'Velocity', icon: '⚡' },
        // { path: '/pellet-tester', label: 'Pellet Test', icon: '🔬' },
        // { path: '/target-setup', label: 'Setup', icon: '⚙️' },
        // { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    // const menuItems = [
    //     { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    //     { path: '/start-event', label: 'Start Event', icon: '🎯' },
    //     { path: '/live', label: 'Live', icon: '🔴' },
    //     { path: '/events-history', label: 'History', icon: '📊' },
    //     { path: '/train-buddy', label: 'Train Buddy', icon: '👥' },
    //     { path: '/performance', label: 'Performance', icon: '📈' },
    //     { path: '/velocity-meter', label: 'Velocity', icon: '⚡' },
    //     { path: '/pellet-tester', label: 'Pellet Test', icon: '🔬' },
    //     { path: '/target-setup', label: 'Setup', icon: '⚙️' },
    //     { path: '/profile', label: 'Profile', icon: '👤' },
    // ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-dark-bg flex">
            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-dark-surface border-r border-dark-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-dark-border">
                        <h1 className="text-2xl font-bold text-gradient">AET10</h1>
                        <p className="text-xs text-gray-500 mt-1">Shooting Training</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${location.pathname === item.path
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:bg-dark-elevated hover:text-gray-200'
                                    }
                `}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-dark-border">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-200 truncate">
                                    {user?.name || 'User'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.isGuest ? 'Guest' : 'Shooter'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full btn btn-secondary text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-dark-surface border-b border-dark-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-gray-400 hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page title */}
                        <h2 className="text-xl font-semibold text-gray-200 hidden lg:block">
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                        </h2>

                        {/* Device status */}
                        <DeviceStatusBadge
                            isConnected={isConnected}
                            deviceName={connectedDevice?.name || 'Target Device'}
                        />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
