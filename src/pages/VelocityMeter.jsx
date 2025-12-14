import React, { useState } from 'react';
import { useVelocityStore } from '@store/velocityStore';
import Button from '@components/Button';
import DataTable from '@components/DataTable';
import TargetImage from '@components/TargetImage';
import { FaHistory, FaSave, FaTrash, FaPlay, FaEdit, FaTimes } from 'react-icons/fa';

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

    // Setup State
    const [weaponName, setWeaponName] = useState('');
    const [pelletName, setPelletName] = useState('');
    const [pelletWeight, setPelletWeight] = useState('');
    const [caliber, setCaliber] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [selectedWeapon, setSelectedWeapon] = useState('Pistol'); // 'Pistol' or 'Rifle'

    // UI State
    const [showHistory, setShowHistory] = useState(true);

    const handleStart = () => {
        if (!weaponName.trim() || !pelletName.trim()) {
            alert('Please enter Weapon Name and Pellet Name');
            return;
        }
        // Include selectedWeapon in weaponName or as a separate field if store supported it, 
        // but for now we can prepend/append it or just rely on the name. 
        // Let's just pass the fields we added to the store.
        startMeasurement(weaponName, pelletName, pelletWeight, caliber, batchNumber);
    };

    const handleAddShot = () => {
        // Simulate velocity measurement (random between 150-180 m/s)
        const velocity = (Math.random() * 30 + 150).toFixed(2);
        addShot(parseFloat(velocity));
    };

    const handleSave = () => {
        completeMeasurement();
        // Reset form or keep values? Usually users test same gear multiple times.
        // Keeping values for convenience.
    };

    const handleCancel = () => {
        if (window.confirm("Cancel current test? Data will be lost.")) {
            cancelMeasurement();
        }
    };

    // History Table Columns
    const historyColumns = [
        { key: 'serialNumber', label: 'Serial No.' },
        { key: 'weaponName', label: 'Weapon' },
        { key: 'pelletUsed', label: 'Pellet' },
        { key: 'pelletWeight', label: 'Weight (g)' },
        { key: 'caliber', label: 'Caliber' },
        { key: 'place', label: 'Batch/Place' }, // stored as 'place' in store but UI calls it Batch per req
        { key: 'average', label: 'Avg Velocity (m/s)' },
        { key: 'completedAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
        {
            key: 'actions', label: 'Actions', render: (_, row) => (
                <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300"><FaEdit /></button>
                    <button className="text-red-400 hover:text-red-300"><FaTrash /></button>
                </div>
            )
        }
    ];

    // If active test is running, show Active View
    if (isActive && currentMeasurement) {
        return (
            <div className="max-w-6xl mx-auto p-6 min-h-screen flex flex-col">
                {/* Header */}
                <div className="glass-panel p-6 mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-dark-text mb-1">Velocity Test</h2>
                        <div className="flex flex-wrap gap-6 text-sm text-dark-muted mt-2">
                            <span>Weapon: <strong className="text-dark-text">{currentMeasurement.weaponName}</strong></span>
                            <span>Pellet: <strong className="text-dark-text">{currentMeasurement.pelletUsed}</strong></span>
                            {currentMeasurement.pelletWeight && <span>Weight: <strong className="text-dark-text">{currentMeasurement.pelletWeight}g</strong></span>}
                            {currentMeasurement.caliber && <span>Caliber: <strong className="text-dark-text">{currentMeasurement.caliber}</strong></span>}
                            <span>Batch: <strong className="text-dark-text">{currentMeasurement.place || 'N/A'}</strong></span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-dark-muted uppercase tracking-widest">Avg Velocity</div>
                        <div className="text-4xl font-bold text-accent-green">
                            {currentMeasurement.shots.length > 0
                                ? (currentMeasurement.shots.reduce((a, b) => a + b, 0) / currentMeasurement.shots.length).toFixed(2)
                                : '0.00'}
                            <span className="text-base font-normal text-dark-text ml-2">m/s</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual Feedback */}
                    <div className="flex flex-col">
                        <div className="glass-card flex-1 flex items-center justify-center">
                            <TargetImage
                                simpleMode={true}
                                size={500}
                                shots={currentMeasurement.shots} // Pass shots to trigger visual dot
                            />
                        </div>
                        {/* Control Bar */}
                        <div className="mt-6 flex gap-4">
                            <Button onClick={handleAddShot} variant="success" size="lg" className="flex-1 py-4 text-xl">
                                <FaPlay className="mr-2" /> FIRE SHOT
                            </Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="flex flex-col h-full space-y-4">
                        <div className="glass-panel flex-1 overflow-hidden flex flex-col">
                            <div className="p-4 bg-black/5 dark:bg-dark-elevated border-b border-dark-border font-bold text-dark-muted flex justify-between">
                                <span>Shot #</span>
                                <span>Velocity (m/s)</span>
                            </div>
                            <div className="overflow-y-auto flex-1 p-0">
                                <table className="w-full">
                                    <tbody className="divide-y divide-dark-border">
                                        {currentMeasurement.shots.map((vel, idx) => (
                                            <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5">
                                                <td className="p-4 text-dark-text font-bold">#{idx + 1}</td>
                                                <td className="p-4 text-right text-primary-500 font-mono text-xl">{vel}</td>
                                            </tr>
                                        ))}
                                        {currentMeasurement.shots.length === 0 && (
                                            <tr>
                                                <td colSpan="2" className="p-8 text-center text-dark-muted">No shots recorded yet</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={handleSave} variant="primary" className="flex-1">
                                <FaSave className="mr-2" /> Save & Finish
                            </Button>
                            <Button onClick={handleCancel} variant="danger" className="flex-1">
                                <FaTimes className="mr-2" /> Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default View: Configuration & History
    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-bold text-dark-text mb-8 border-b border-dark-border pb-4">Velocity Meter</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-accent-cyan mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-accent-cyan rounded-full"></span>
                            New Test Setup
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-dark-muted mb-2">Select Weapon Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedWeapon('Pistol')}
                                        className={`p-3 rounded-lg font-bold transition-all ${selectedWeapon === 'Pistol'
                                            ? 'bg-primary-600 text-white ring-2 ring-primary-400'
                                            : 'bg-dark-elevated text-dark-muted hover:bg-dark-elevated/80'}`}
                                    >
                                        Pistol
                                    </button>
                                    <button
                                        onClick={() => setSelectedWeapon('Rifle')}
                                        className={`p-3 rounded-lg font-bold transition-all ${selectedWeapon === 'Rifle'
                                            ? 'bg-primary-600 text-white ring-2 ring-primary-400'
                                            : 'bg-dark-elevated text-dark-muted hover:bg-dark-elevated/80'}`}
                                    >
                                        Rifle
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark-muted mb-2">Weapon Name</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="e.g. Steyr LP10"
                                    value={weaponName}
                                    onChange={(e) => setWeaponName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark-muted mb-2">Pellet Name</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="e.g. RWS R10 Match"
                                    value={pelletName}
                                    onChange={(e) => setPelletName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark-muted mb-2">Weight of Pellet (g)</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="e.g. 0.53"
                                    value={pelletWeight}
                                    onChange={(e) => setPelletWeight(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark-muted mb-2">Caliber</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="e.g. 4.5mm"
                                    value={caliber}
                                    onChange={(e) => setCaliber(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark-muted mb-2">Batch Number</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="Optional"
                                    value={batchNumber}
                                    onChange={(e) => setBatchNumber(e.target.value)}
                                />
                            </div>

                            <Button onClick={handleStart} variant="success" size="lg" className="w-full mt-4 py-4 text-xl">
                                Start Test
                            </Button>
                        </div>
                    </div>
                </div>

                {/* History Panel */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-dark-text flex items-center gap-2">
                            <FaHistory className="text-dark-muted" /> Test History
                        </h2>
                    </div>

                    <div className="glass-panel overflow-hidden">
                        <DataTable columns={historyColumns} data={measurements} />
                        {measurements.length === 0 && (
                            <div className="p-12 text-center text-dark-muted">
                                No history available. Start a new test to see results here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
