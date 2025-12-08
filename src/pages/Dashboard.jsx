import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import TileCard from '@components/TileCard';
import { getTagline } from '@/config/appConfig';
import { FaBullseye, FaCircle, FaChartBar, FaUserFriends, FaChartLine, FaBolt, FaMicroscope, FaCog, FaUser, FaTrophy, FaBell, FaBullhorn } from 'react-icons/fa';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const tiles = [
        { icon: <FaBullseye className="text-4xl" />, title: 'Start New Event', description: 'Begin a new shooting session', path: '/start-event' },
        { icon: <FaCircle className="text-4xl text-red-500" />, title: 'Start Live View', description: 'Go to live shooting mode', path: '/live' },
        { icon: <FaChartBar className="text-4xl" />, title: 'Events History', description: 'View past sessions', path: '#' },
        { icon: <FaUserFriends className="text-4xl" />, title: 'Train with Buddy', description: 'Multi-user training', path: '#' },
        { icon: <FaChartLine className="text-4xl" />, title: 'Performance', description: 'Analytics and insights', path: '#' },
        { icon: <FaBolt className="text-4xl" />, title: 'Velocity Meter', description: 'Measure shot velocity', path: '#' },
        { icon: <FaMicroscope className="text-4xl" />, title: 'Pellet Tester', description: 'Test different pellets', path: '/pellet-tester' },
        { icon: <FaCog className="text-4xl" />, title: 'Target Setup', description: 'Configure device', path: '#' },
        { icon: <FaUser className="text-4xl" />, title: 'Profile Settings', description: 'Manage your profile', path: '#' },
        { icon: <FaTrophy className="text-4xl" />, title: 'Competition Mode', description: 'Official competitions', path: '#' },
        { icon: <FaBell className="text-4xl" />, title: 'Notifications', description: 'View alerts', path: '#' },
        { icon: <FaBullhorn className="text-4xl" />, title: 'Advertisements', description: 'Latest updates', path: '#' },
    ];

    // const tiles = [
    //     { icon: '🎯', title: 'Start New Event', description: 'Begin a new shooting session', path: '/start-event' },
    //     { icon: '🔴', title: 'Start Live View', description: 'Go to live shooting mode', path: '/live' },
    //     { icon: '📊', title: 'Events History', description: 'View past sessions', path: '/events-history' },
    //     { icon: '👥', title: 'Train with Buddy', description: 'Multi-user training', path: '/train-buddy' },
    //     { icon: '📈', title: 'Performance', description: 'Analytics and insights', path: '/performance' },
    //     { icon: '⚡', title: 'Velocity Meter', description: 'Measure shot velocity', path: '/velocity-meter' },
    //     { icon: '🔬', title: 'Pellet Tester', description: 'Test different pellets', path: '/pellet-tester' },
    //     { icon: '⚙️', title: 'Target Setup', description: 'Configure device', path: '/target-setup' },
    //     { icon: '👤', title: 'Profile Settings', description: 'Manage your profile', path: '/profile' },
    //     { icon: '🏆', title: 'Competition Mode', description: 'Official competitions', path: '/competition' },
    //     { icon: '🔔', title: 'Notifications', description: 'View alerts', path: '#' },
    //     { icon: '📢', title: 'Advertisements', description: 'Latest updates', path: '#' },
    // ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">
                    Welcome, {user?.name || 'Shooter'}!
                </h1>
                <p className="text-gray-400">{getTagline()}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tiles.map((tile, index) => (
                    <TileCard
                        key={index}
                        icon={tile.icon}
                        title={tile.title}
                        description={tile.description}
                        badge={tile.badge}
                        onClick={() => tile.path !== '#' && navigate(tile.path)}
                    />
                ))}
            </div>
        </div>
    );
}
