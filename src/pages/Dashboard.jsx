import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import TileCard from '@components/TileCard';
import { FaBullseye, FaCircle, FaChartBar, FaUserFriends, FaChartLine, FaBolt, FaMicroscope, FaCog, FaUser, FaTrophy, FaBell, FaBullhorn, FaCrosshairs } from 'react-icons/fa';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [showJoinModal, setShowJoinModal] = React.useState(false);
    const [liveCode, setLiveCode] = React.useState('');

    const transparentIcon = "text-4xl text-indigo-400/70";

    const handleJoinLive = () => {
        if (liveCode.length < 4) {
            alert("Please enter a valid code");
            return;
        }
        navigate('/live', { state: { viewOnly: true, code: liveCode } });
    };

    const tiles = [
        { icon: <FaBullseye className={transparentIcon} />, title: 'Start New Event', description: 'Begin a new shooting session', path: '/start-event' },
        {
            icon: <FaCircle className="text-4xl text-blue-500 animate-pulse" />,
            title: 'Start Live View',
            description: 'Join a live broadcast',
            action: () => setShowJoinModal(true)
        },
        { icon: <FaChartBar className={transparentIcon} />, title: 'Events History', description: 'View past sessions', path: '/events-history' },
        { icon: <FaUserFriends className={transparentIcon} />, title: 'Train with Buddy', description: 'Multi-user training', path: '/train-buddy' },
        { icon: <FaChartLine className={transparentIcon} />, title: 'Performance', description: 'Analytics and insights', path: '/performance' },
        { icon: <FaBolt className={transparentIcon} />, title: 'Velocity Meter', description: 'Measure shot velocity', path: '/velocity-meter' },
        { icon: <FaMicroscope className={transparentIcon} />, title: 'Pellet Tester', description: 'Test different pellets', path: '/pellet-tester' },
        { icon: <FaCog className={transparentIcon} />, title: 'Target Setup', description: 'Configure device', path: '/target-setup' },
        { icon: <FaUser className={transparentIcon} />, title: 'Profile Settings', description: 'Manage your profile', path: '/profile' },
        { icon: <FaTrophy className={transparentIcon} />, title: 'Range Connectivity', description: 'Connect range devices', path: '/range-connectivity' },
        { icon: <FaCrosshairs className={transparentIcon} />, title: 'Skill Mode', description: 'Coming Soon', path: '#' },
        { icon: <FaBell className={transparentIcon} />, title: 'Notifications', description: 'View alerts', path: '#' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">
                    Welcome, {user?.name || 'Shooter'}!
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tiles.map((tile, index) => (
                    <TileCard
                        key={index}
                        icon={tile.icon}
                        title={tile.title}
                        description={tile.description}
                        badge={tile.badge}
                        onClick={() => tile.action ? tile.action() : (tile.path !== '#' && navigate(tile.path))}
                    />
                ))}
            </div>

            {/* Join Live View Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark-surface p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl transform transition-all scale-100">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Join Live Session</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Enter Live Code</label>
                                <input
                                    type="text"
                                    value={liveCode}
                                    onChange={(e) => setLiveCode(e.target.value.toUpperCase())}
                                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-4 text-center text-3xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-primary-500 transition-colors uppercase placeholder-gray-700"
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button
                                    onClick={() => setShowJoinModal(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleJoinLive}
                                    disabled={liveCode.length < 4}
                                    className="px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 transition-all"
                                >
                                    Join View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
