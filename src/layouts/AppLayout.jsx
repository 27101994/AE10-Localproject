import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useDeviceStore } from '@store/deviceStore';
import { useThemeStore } from '@store/themeStore';
import DeviceStatusBadge from '@components/DeviceStatusBadge';
import athieonLogo from '@/assets/athieon-logo.png';
import { FaHome, FaTrophy, FaBars, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isConnected, connectedDevice } = useDeviceStore();
    const { theme, toggleTheme } = useThemeStore();

    // Updated icon styles for the glass theme
    const iconClass = "text-xl transition-all duration-300 group-hover:scale-110 group-hover:text-primary-400";

    // Simplified menu - only essential items not in dashboard tiles
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FaHome className={iconClass} /> },
        { path: '/competition', label: 'Range Connectivity', icon: <FaTrophy className={iconClass} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`h-screen font-sans flex overflow-hidden ${theme === 'dark'
            ? 'bg-dark-bg bg-gradient-mesh text-dark-text selection:bg-primary-500/30'
            : 'bg-gray-100 text-gray-900 selection:bg-blue-500/30'
            }`}>

            {/* Floating Glass Sidebar (Desktop) */}
            <aside className={`
                fixed inset-y-4 left-4 z-50 w-72 
                ${theme === 'dark' ? 'glass-panel' : 'bg-white shadow-xl'} rounded-3xl flex flex-col
                transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
            `}>
                <div className="h-full flex flex-col p-4">
                    {/* Logo and branding */}
                    <div className={`px-4 py-6 border-b mb-2 relative ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}>
                        {/* Glow effect behind logo */}
                        {theme === 'dark' && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-500/20 blur-3xl rounded-full pointer-events-none"></div>
                        )}

                        <div className="flex items-center justify-center mb-4 relative z-10">
                            <img
                                src={athieonLogo}
                                alt="Athieon"
                                className={`h-28 w-auto ${theme === 'dark' ? 'mix-blend-screen' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto space-y-2 py-4 custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        group flex items-center space-x-4 px-4 py-4 rounded-2xl
                                        transition-all duration-300 relative overflow-hidden
                                        ${isActive
                                            ? theme === 'dark'
                                                ? 'text-white bg-gradient-to-r from-primary-600/20 to-primary-500/10 shadow-[0_0_20px_rgba(14,165,233,0.15)] border border-primary-500/20'
                                                : 'text-blue-600 bg-blue-50 border border-blue-200'
                                            : theme === 'dark'
                                                ? 'text-dark-muted hover:text-white hover:bg-white/5 border border-transparent'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                                        }
                                    `}
                                >
                                    {/* Active Indicator Line */}
                                    {isActive && (
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full 
                                            ${theme === 'dark' ? 'bg-primary-500 shadow-[0_0_10px_#0ea5e9]' : 'bg-blue-500'}`}></div>
                                    )}

                                    <span className={`${isActive
                                        ? theme === 'dark' ? 'text-primary-400' : 'text-blue-500'
                                        : theme === 'dark' ? 'text-dark-muted group-hover:text-white' : 'text-gray-400 group-hover:text-gray-600'
                                        } transition-colors duration-300`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium tracking-wide text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>


                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className={`fixed inset-0 z-40 lg:hidden ${theme === 'dark' ? 'bg-dark-bg/80' : 'bg-gray-900/50'} backdrop-blur-sm`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-[20rem]">
                {/* Floating Header - Hidden on Live page */}
                {location.pathname !== '/live' && (
                    <header className="sticky top-4 z-40 mx-4 lg:mr-8 mb-6">
                        <div className={`${theme === 'dark' ? 'glass-panel' : 'bg-white shadow-md border-gray-100 border'} rounded-2xl px-6 py-4 flex items-center justify-between`}>
                            {/* Mobile menu button */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className={`lg:hidden transition-colors p-1 ${theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <FaBars className="w-6 h-6" />
                                </button>

                                {/* Page title / Breadcrumb */}
                                <h2 className={`text-lg font-semibold tracking-wide hidden sm:block ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                    <span className={`${theme === 'dark' ? 'text-primary-500' : 'text-blue-500'} opacity-60`}>AET</span>
                                    <span className={`mx-2 ${theme === 'dark' ? 'text-dark-border' : 'text-gray-300'}`}>/</span>
                                    {menuItems.find(item => item.path === location.pathname)?.label || 'Overview'}
                                </h2>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                        ? 'text-yellow-400 hover:bg-white/10'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                                        }`}
                                    title="Toggle Theme"
                                >
                                    {theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
                                </button>

                                <DeviceStatusBadge
                                    isConnected={isConnected}
                                    deviceName={connectedDevice?.name || 'Target Device'}
                                />

                                {/* User Profile & Logout */}
                                <div className={`flex items-center gap-3 pl-4 ml-2 border-l ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                                    <div className="text-right hidden sm:block">
                                        <p className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user?.name || 'User'}</p>
                                        <p className={`text-xs truncate ${theme === 'dark' ? 'text-primary-400' : 'text-blue-500'}`}>{user?.isGuest ? 'Guest Access' : 'Shooter'}</p>
                                    </div>
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold shadow-lg ${theme === 'dark'
                                        ? 'bg-gradient-to-br from-primary-600 to-primary-400 shadow-primary-500/20'
                                        : 'bg-gradient-to-br from-blue-600 to-blue-400 shadow-blue-500/20'
                                        }`}>
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className={`p-2 transition-colors rounded-lg ${theme === 'dark'
                                            ? 'text-dark-muted hover:text-red-400 hover:bg-red-500/10'
                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                        title="Logout"
                                    >
                                        <FaSignOutAlt />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                {/* Page Content Container */}
                <main className="flex-1 px-4 pb-6 lg:pr-8 overflow-y-auto custom-scrollbar">
                    <div className="animate-fade-in h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
