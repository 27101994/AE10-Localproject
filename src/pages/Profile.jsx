import React, { useState } from 'react';
import { useAuthStore } from '@store/authStore';
import Button from '@components/Button';

export default function Profile() {
    const { user } = useAuthStore();

    const [profile, setProfile] = useState({
        name: user?.name || 'Shooter Name',
        age: 25,
        address: '123 Shooting Range Road, City, Country',
        shooterId: 'SH-2024-001',
        coachName: 'Coach John Doe',
        totalHours: 245.5,
        eventsPlaying: ['10m Air Pistol', '10m Air Rifle'],
    });

    const [isEditing, setIsEditing] = useState(false);

    const stats = [
        { label: 'Total Sessions', value: '156' },
        { label: 'Best Score', value: '95.8' },
        { label: 'Avg Score', value: '89.2' },
        { label: 'Total Shots', value: '9,340' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Profile</h1>
                <p className="text-gray-400">Manage your shooter profile</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-elevated">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {profile.name[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-100">{profile.name}</h2>
                                <p className="text-gray-400">Shooter ID: {profile.shooterId}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Age</label>
                                    <div className="text-gray-200 font-medium">{profile.age}</div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Coach</label>
                                    <div className="text-gray-200 font-medium">{profile.coachName}</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Address</label>
                                <div className="text-gray-200 font-medium">{profile.address}</div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Events Playing</label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.eventsPlaying.map((event, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm"
                                        >
                                            {event}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Total Shooting Hours</label>
                                <div className="text-3xl font-bold text-primary-400">{profile.totalHours}h</div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-dark-border">
                            <Button
                                variant={isEditing ? 'success' : 'primary'}
                                onClick={() => setIsEditing(!isEditing)}
                                className="w-full"
                            >
                                {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats sidebar */}
                <div className="space-y-4">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Statistics</h3>
                        <div className="space-y-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center p-3 bg-dark-elevated rounded-lg">
                                    <div className="text-2xl font-bold text-primary-400">{stat.value}</div>
                                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Achievements</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🥇</span>
                                <div>
                                    <div className="text-sm font-medium text-gray-200">Gold Medal</div>
                                    <div className="text-xs text-gray-500">State Championship</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🎯</span>
                                <div>
                                    <div className="text-sm font-medium text-gray-200">Perfect 10</div>
                                    <div className="text-xs text-gray-500">100 consecutive shots</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
