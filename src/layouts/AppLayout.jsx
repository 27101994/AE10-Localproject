import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useDeviceStore } from '@store/deviceStore';
import DeviceStatusBadge from '@components/DeviceStatusBadge';
import athieonLogo from '@/assets/athieon-logo.png';
import { getProductName, getTagline } from '@/config/appConfig';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isConnected, connectedDevice } = useDeviceStore();

    // Simplified menu - only essential items not in dashboard tiles
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/competition', label: 'Competition', icon: '🏆' },
    ];

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
                    {/* Logo and branding */}
                    <div className="p-6 border-b border-dark-border">
                        {/* Athieon Logo - Inverted for dark theme */}
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src={athieonLogo}
                                alt="Athieon"
                                className="h-12 w-auto"
                                style={{ filter: 'invert(1) brightness(1)' }}
                            />
                        </div>

                        {/* Product Model */}
                        <h1 className="text-lg font-bold text-gray-100 text-center">{getProductName()}</h1>
                        <p className="text-xs text-primary-400 text-center mt-1 font-medium">{getTagline()}</p>
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

                </div>
            </aside>

            {/* Overlay for mobile */}
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )
            }

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

                        {/* User Section */}
                        <div className="flex items-center space-x-3 pl-4 border-l border-dark-border ml-4">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-medium text-gray-200">{user?.name || 'User'}</div>
                                <div className="text-xs text-gray-500">{user?.isGuest ? 'Guest' : 'Shooter'}</div>
                            </div>

                            <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {user?.name?.[0] || 'U'}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-elevated rounded-lg transition-colors"
                                title="Logout"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div >
    );
}
