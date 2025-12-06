import React from 'react';
import { useNavigate } from 'react-router-dom';
import TileCard from '@components/TileCard';

export default function Dashboard() {
    const navigate = useNavigate();

      const tiles = [
        { icon: '🎯', title: 'Start New Event', description: 'Begin a new shooting session', path: '#', badge: 'Priority 1' },
        { icon: '🔴', title: 'Start Live View', description: 'Go to live shooting mode', path: '#', badge: 'Priority 1' },
        { icon: '📊', title: 'Events History', description: 'View past sessions', path: '#', badge: 'Priority 1' },
        { icon: '👥', title: 'Train with Buddy', description: 'Multi-user training', path: '#' },
        { icon: '📈', title: 'Performance', description: 'Analytics and insights', path: '#' },
        { icon: '⚡', title: 'Velocity Meter', description: 'Measure shot velocity', path: '#' },
        { icon: '🔬', title: 'Pellet Tester', description: 'Test different pellets', path: '#' },
        { icon: '⚙️', title: 'Target Setup', description: 'Configure device', path: '#' },
        { icon: '👤', title: 'Profile Settings', description: 'Manage your profile', path: '#' },
        { icon: '🏆', title: 'Competition Mode', description: 'Official competitions', path: '#' },
        { icon: '🎮', title: 'Skill Mode', description: 'Training exercises', path: '#', badge: 'Coming Soon' },
        { icon: '🔔', title: 'Notifications', description: 'View alerts', path: '#' },
        { icon: '📢', title: 'Advertisements', description: 'Latest updates', path: '#' },
    ];

    // const tiles = [
    //     { icon: '🎯', title: 'Start New Event', description: 'Begin a new shooting session', path: '/start-event', badge: 'Priority 1' },
    //     { icon: '🔴', title: 'Start Live View', description: 'Go to live shooting mode', path: '/live', badge: 'Priority 1' },
    //     { icon: '📊', title: 'Events History', description: 'View past sessions', path: '/events-history', badge: 'Priority 1' },
    //     { icon: '👥', title: 'Train with Buddy', description: 'Multi-user training', path: '/train-buddy' },
    //     { icon: '📈', title: 'Performance', description: 'Analytics and insights', path: '/performance' },
    //     { icon: '⚡', title: 'Velocity Meter', description: 'Measure shot velocity', path: '/velocity-meter' },
    //     { icon: '🔬', title: 'Pellet Tester', description: 'Test different pellets', path: '/pellet-tester' },
    //     { icon: '⚙️', title: 'Target Setup', description: 'Configure device', path: '/target-setup' },
    //     { icon: '👤', title: 'Profile Settings', description: 'Manage your profile', path: '/profile' },
    //     { icon: '🏆', title: 'Competition Mode', description: 'Official competitions', path: '/competition' },
    //     { icon: '🎮', title: 'Skill Mode', description: 'Training exercises', path: '#', badge: 'Coming Soon' },
    //     { icon: '🔔', title: 'Notifications', description: 'View alerts', path: '#' },
    //     { icon: '📢', title: 'Advertisements', description: 'Latest updates', path: '#' },
    // ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome to your shooting training system</p>
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
