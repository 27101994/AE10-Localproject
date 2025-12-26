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

    // Apply theme class to HTML element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    return (
        <div className="h-screen font-sans flex overflow-hidden bg-dark-bg text-dark-text selection:bg-primary-500/30">
            {/* Background mesh only for dark mode or subtle for light */}
            <div className="absolute inset-0 bg-gradient-mesh pointer-events-none z-0 opacity-40 dark:opacity-100"></div>

            {/* Floating Glass Sidebar (Desktop) */}
            {location.pathname !== '/live' && (
                <aside className={`
                fixed inset-y-4 left-4 z-50 w-72 
                glass-panel rounded-3xl flex flex-col
                transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
            `}>
                    <div className="h-full flex flex-col p-4 relative z-10">
                        {/* Logo and branding */}
                        <div className="px-4 py-6 border-b border-dark-border mb-2 relative">
                            {/* Glow effect - only visible in dark mode via CSS variables or specific dark classes */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-500/20 blur-3xl rounded-full pointer-events-none opacity-0 dark:opacity-100"></div>

                            <div className="flex items-center justify-center mb-4 relative z-10">
                                <img
                                    src={athieonLogo}
                                    alt="Athieon"
                                    className="h-28 w-auto invert dark:invert-0"
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
                                                ? 'text-primary-600 dark:text-white bg-primary-500/15 dark:bg-gradient-to-r dark:from-primary-600/20 dark:to-primary-500/10 shadow-[0_0_20px_rgba(14,165,233,0.15)] border-2 border-primary-600 dark:border-primary-500/20'
                                                : 'text-dark-muted hover:text-dark-text hover:bg-dark-elevated/50 border border-transparent'
                                            }
                                    `}
                                    >
                                        {/* Active Indicator Line */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary-500 shadow-[0_0_10px_#0ea5e9]"></div>
                                        )}

                                        <span className={`${isActive
                                            ? 'text-primary-500 dark:text-primary-400'
                                            : 'text-dark-muted group-hover:text-primary-500 dark:group-hover:text-white'
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
            )}

            {/* Mobile Overlay */}
            {sidebarOpen && location.pathname !== '/live' && (
                <div
                    className="fixed inset-0 z-40 lg:hidden bg-dark-bg/80 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 ${location.pathname !== '/live' ? 'lg:pl-[20rem]' : ''}`}>
                {/* Floating Header */}
                {location.pathname !== '/live' && (
                    <header className="sticky top-4 z-40 mx-4 lg:mr-8 mb-6">
                        <div className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between">
                            {/* Mobile menu button */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="lg:hidden transition-colors p-1 text-dark-muted hover:text-dark-text"
                                >
                                    <FaBars className="w-6 h-6" />
                                </button>

                                {/* Page title */}
                                <h2 className="text-lg font-semibold tracking-wide hidden sm:block text-dark-text">
                                    <span className="text-primary-500 opacity-60">AET</span>
                                    <span className="mx-2 text-dark-border">/</span>
                                    {menuItems.find(item => item.path === location.pathname)?.label || 'Overview'}
                                </h2>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg transition-colors text-dark-muted hover:text-primary-500 hover:bg-dark-elevated"
                                    title="Toggle Theme"
                                >
                                    {theme === 'dark' ? <FaSun className="text-xl text-yellow-400" /> : <FaMoon className="text-xl" />}
                                </button>

                                <DeviceStatusBadge
                                    isConnected={isConnected}
                                    deviceName={connectedDevice?.name || 'Target Device'}
                                />

                                {/* User Profile & Logout */}
                                <div className="flex items-center gap-3 pl-4 ml-2 border-l border-dark-border">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-semibold truncate text-dark-text">{user?.name || 'User'}</p>
                                        <p className="text-xs truncate text-primary-500">{user?.isGuest ? 'Guest Access' : 'Shooter'}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold shadow-lg bg-gradient-to-br from-primary-600 to-primary-400 shadow-primary-500/20">
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 transition-colors rounded-lg text-dark-muted hover:text-red-400 hover:bg-red-500/10"
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
