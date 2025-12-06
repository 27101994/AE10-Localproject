import React, { useState } from 'react';
import { useVelocityStore } from '@store/velocityStore';
import Button from '@components/Button';
import DataTable from '@components/DataTable';

export default function VelocityMeter() {
    const {
        measurements,
        currentMeasurement,
        isActive,
        startMeasurement,
        addShot,
        completeMeasurement,
        cancelMeasurement,
    } = useVelocityStore();

    const [weaponName, setWeaponName] = useState('');
    const [pelletUsed, setPelletUsed] = useState('');
    const [place, setPlace] = useState('');
    const [showSetup, setShowSetup] = useState(true);

    const handleStart = () => {
        if (!weaponName.trim()) {
            alert('Please enter weapon name');
            return;
        }
        startMeasurement(weaponName, pelletUsed, place);
        setShowSetup(false);
    };

    const handleAddShot = () => {
        // Simulate velocity measurement (random between 150-180 m/s)
        const velocity = (Math.random() * 30 + 150).toFixed(2);
        addShot(parseFloat(velocity));
    };

    const handleComplete = () => {
        completeMeasurement();
        setShowSetup(true);
        setWeaponName('');
        setPelletUsed('');
        setPlace('');
    };

    const handleCancel = () => {
        cancelMeasurement();
        setShowSetup(true);
    };

    const historyColumns = [
        { key: 'serialNumber', label: 'Serial No.' },
        { key: 'weaponName', label: 'Weapon' },
        { key: 'pelletUsed', label: 'Pellet' },
        { key: 'average', label: 'Avg Velocity (m/s)' },
        { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Velocity Meter</h1>
                <p className="text-gray-400">Measure shot velocity with 5 continuous shots</p>
            </div>

            {showSetup && !isActive ? (
                /* Setup Form */
                <div className="card-elevated max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-100 mb-6">Setup Measurement</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Weapon Name *
                            </label>
                            <input
                                type="text"
                                value={weaponName}
                                onChange={(e) => setWeaponName(e.target.value)}
                                className="input w-full"
                                placeholder="e.g., Walther LP400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Pellet Used
                            </label>
                            <input
                                type="text"
                                value={pelletUsed}
                                onChange={(e) => setPelletUsed(e.target.value)}
                                className="input w-full"
                                placeholder="e.g., RWS R10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Place
                            </label>
                            <input
                                type="text"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
                                className="input w-full"
                                placeholder="e.g., Indoor Range"
                            />
                        </div>

                        <Button variant="success" size="lg" onClick={handleStart} className="w-full">
                            Start Measurement
                        </Button>
                    </div>
                </div>
            ) : isActive && currentMeasurement ? (
                /* Active Measurement */
                <div className="space-y-6">
                    <div className="card">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-100 mb-2">{currentMeasurement.weaponName}</h2>
                            <p className="text-gray-400">
                                Shot {currentMeasurement.shots.length} of 5
                            </p>
                        </div>

                        {/* Shot Counter */}
                        <div className="flex justify-center space-x-3 mb-8">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                    key={num}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${num <= currentMeasurement.shots.length
                                            ? 'bg-accent-green text-white'
                                            : 'bg-dark-elevated text-gray-500'
                                        }`}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>

                        {/* Velocity Readings */}
                        {currentMeasurement.shots.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-200 mb-3">Velocity Readings</h3>
                                <div className="grid grid-cols-5 gap-3">
                                    {currentMeasurement.shots.map((velocity, index) => (
                                        <div key={index} className="bg-dark-elevated rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 mb-1">Shot {index + 1}</div>
                                            <div className="text-xl font-bold text-primary-400">{velocity}</div>
                                            <div className="text-xs text-gray-500">m/s</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            {currentMeasurement.shots.length < 5 ? (
                                <Button variant="success" size="lg" onClick={handleAddShot} className="flex-1">
                                    Take Shot {currentMeasurement.shots.length + 1}
                                </Button>
                            ) : (
                                <Button variant="success" size="lg" onClick={handleComplete} className="flex-1">
                                    Complete Measurement
                                </Button>
                            )}
                            <Button variant="secondary" size="lg" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Measurement History */}
            {measurements.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Measurement History</h2>
                    <DataTable columns={historyColumns} data={measurements} />
                </div>
            )}
        </div>
    );
}
