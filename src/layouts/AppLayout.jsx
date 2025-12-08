import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useDeviceStore } from '@store/deviceStore';
import DeviceStatusBadge from '@components/DeviceStatusBadge';
import athieonLogo from '@/assets/athieon-logo.png';
import { getTagline } from '@/config/appConfig';
import { FaHome, FaTrophy, FaBars, FaSignOutAlt } from 'react-icons/fa';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isConnected, connectedDevice } = useDeviceStore();
    const transparentIcon = "text-2xl text-indigo-300/70 transition-all duration-200";
    // Simplified menu - only essential items not in dashboard tiles
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FaHome className={transparentIcon} /> },
        { path: '/competition', label: 'Competition', icon: <FaTrophy className={transparentIcon} /> },
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
                                className="h-25 w-auto"
                                style={{ filter: 'invert(1) brightness(2)', mixBlendMode: 'screen' }}
                            />
                        </div>

                        {/* Product Model */}
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
                            <FaBars className="w-6 h-6" />
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
                                <FaSignOutAlt className="w-5 h-5" />
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
