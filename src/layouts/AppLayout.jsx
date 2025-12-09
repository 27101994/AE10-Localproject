import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useDeviceStore } from '@store/deviceStore';
import DeviceStatusBadge from '@components/DeviceStatusBadge';
import athieonLogo from '@/assets/athieon-logo.png';
import { FaHome, FaTrophy, FaBars, FaSignOutAlt } from 'react-icons/fa';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isConnected, connectedDevice } = useDeviceStore();

    // Updated icon styles for the glass theme
    const iconClass = "text-xl transition-all duration-300 group-hover:scale-110 group-hover:text-primary-400";

    // Simplified menu - only essential items not in dashboard tiles
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FaHome className={iconClass} /> },
        { path: '/competition', label: 'Competition', icon: <FaTrophy className={iconClass} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="h-screen bg-dark-bg bg-gradient-mesh text-dark-text font-sans selection:bg-primary-500/30 flex overflow-hidden">

            {/* Floating Glass Sidebar (Desktop) */}
            <aside className={`
                fixed inset-y-4 left-4 z-50 w-72 
                glass-panel rounded-3xl flex flex-col
                transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
            `}>
                <div className="h-full flex flex-col p-4">
                    {/* Logo and branding */}
                    <div className="px-4 py-6 border-b border-white/5 mb-2 relative">
                        {/* Glow effect behind logo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-500/20 blur-3xl rounded-full pointer-events-none"></div>

                        <div className="flex items-center justify-center mb-4 relative z-10">
                            <img
                                src={athieonLogo}
                                alt="Athieon"
                                className="h-20 w-auto mix-blend-screen"
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
                                            ? 'text-white bg-gradient-to-r from-primary-600/20 to-primary-500/10 shadow-[0_0_20px_rgba(14,165,233,0.15)] border border-primary-500/20'
                                            : 'text-dark-muted hover:text-white hover:bg-white/5 border border-transparent'
                                        }
                                    `}
                                >
                                    {/* Active Indicator Line */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary-500 rounded-r-full shadow-[0_0_10px_#0ea5e9]"></div>
                                    )}

                                    <span className={`${isActive ? 'text-primary-400' : 'text-dark-muted group-hover:text-white'} transition-colors duration-300`}>
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
                    className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-[20rem]">
                {/* Floating Header */}
                <header className="sticky top-4 z-40 mx-4 lg:mr-8 mb-6">
                    <div className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between">
                        {/* Mobile menu button */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden text-dark-muted hover:text-white transition-colors p-1"
                            >
                                <FaBars className="w-6 h-6" />
                            </button>

                            {/* Page title / Breadcrumb */}
                            <h2 className="text-lg font-semibold text-white tracking-wide hidden sm:block">
                                <span className="text-primary-500 opacity-60">AET</span>
                                <span className="mx-2 text-dark-border">/</span>
                                {menuItems.find(item => item.path === location.pathname)?.label || 'Overview'}
                            </h2>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <DeviceStatusBadge
                                isConnected={isConnected}
                                deviceName={connectedDevice?.name || 'Target Device'}
                            />

                            {/* User Profile & Logout */}
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-primary-400 truncate">{user?.isGuest ? 'Guest Access' : 'Shooter'}</p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                                    {user?.name?.[0] || 'U'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-dark-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                                    title="Logout"
                                >
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

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
