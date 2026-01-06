import React, { useState, useMemo } from 'react';
import { usePelletStore } from '@store/pelletStore';
import TargetImage from '@components/TargetImage';
import Button from '@components/Button';
import DataTable from '@components/DataTable';
import { generateDummyShot, calculateGroupCenter, calculateGroupRadius } from '@utils/shootingUtils';
import { FaBullseye, FaCheck, FaSave, FaSync, FaCircle, FaHistory, FaCrosshairs, FaTrash, FaEdit, FaPlay } from 'react-icons/fa';

export default function PelletTester() {
    const {
        pellets,
        currentPellet,
        currentTestConfig,
        testShots,
        startPelletTest,
        addTestShot,
        savePelletTest,
        resetPelletTest,
    } = usePelletStore();

    // Local State
    const [weaponName, setWeaponName] = useState('');
    const [pelletName, setPelletName] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [pelletWeight, setPelletWeight] = useState('');
    const [caliber, setCaliber] = useState('');
    const [weaponType, setWeaponType] = useState('pistol');

    const [isCalibrated, setIsCalibrated] = useState(false);

    // Derived Shots for Display
    const displayedShots = useMemo(() => {
        if (!isCalibrated) {
            // Blind Mode: "just black circle one red dot pop up in mddle to indicate shot recorded"
            // Since we use TargetImage or custom view, let's prepare data.
            // If we have shots, show 1 dummy shot at center? Or pass empty array and handle visual separate?
            // Let's return empty array here and render the "Blind View" manually in the JSX.
            return [];
        }

        // Calibrated Mode: "all shots will be plced on centree of target"
        const center = calculateGroupCenter(testShots);

        // Target center is 0,0 in our coordinate system logic (relative)
        // Shift every shot so group center moves to 0,0
        return testShots.map(shot => ({
            ...shot,
            x: shot.x - center.x,
            y: shot.y - center.y,
        }));
    }, [testShots, isCalibrated]);

    // Calculate Group Radius (only valid when shots >= 2 usually, but function handles checks)
    const groupResult = useMemo(() => {
        if (testShots.length > 0) {
            return calculateGroupRadius(testShots);
        }
        return 0;
    }, [testShots]);

    const handleStart = () => {
        if (pelletName.trim() && weaponName.trim()) {
            startPelletTest({
                weaponName,
                pelletName,
                batchNumber,
                pelletWeight,
                caliber,
                weaponType
            });
            setIsCalibrated(false);
        } else {
            alert("Please fill in Weapon Name and Pellet Name");
        }
    };

    const handleAddShot = () => {
        // Unlimited shots allowed
        const shot = generateDummyShot(testShots.length + 1);
        addTestShot(shot);
    };

    const handleCalibrate = () => {
        setIsCalibrated(true);
    };

    const handleSave = () => {
        savePelletTest();
        // Reset form inputs if needed, or keep for next test
        alert('Pellet test saved!');
    };

    const handleCancel = () => {
        if (window.confirm("Cancel current test?")) {
            resetPelletTest();
            setIsCalibrated(false);
        }
    }

    const columns = [
        { key: 'index', label: 'SL', render: (_, row, index) => index + 1 },
        { key: 'pelletName', label: 'Pellet', align: 'left' },
        { key: 'weaponName', label: 'Weapon', align: 'left' },
        { key: 'batchNumber', label: 'Batch', align: 'left' },
        { key: 'groupDiameter', label: 'Group Dia', align: 'right', render: (value) => <span className="text-accent-green font-bold">{value} mm</span> },
        { key: 'weaponType', label: 'Type', align: 'center', render: (val) => <span className="uppercase text-xs font-bold px-2 py-1 rounded bg-dark-elevated">{val}</span> },
        {
            key: 'actions', label: 'Actions', render: () => (
                <div className="flex gap-2 justify-center">
                    <button className="text-blue-400 hover:text-blue-300"><FaEdit /></button>
                    <button className="text-red-400 hover:text-red-300"><FaTrash /></button>
                </div>
            )
        }
    ];

    // Form View
    if (!currentPellet) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-dark-text mb-8 border-b border-dark-border pb-4">Pellet Tester</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Setup Form */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-accent-purple mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-accent-purple rounded-full"></span>
                                New Pellet Test
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-dark-muted mb-2">Select Weapon Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setWeaponType('pistol')}
                                            className={`p-3 rounded-lg font-bold transition-all ${weaponType === 'pistol' ? 'bg-primary-600 text-white ring-2 ring-primary-400' : 'bg-dark-elevated text-dark-muted hover:bg-dark-elevated/80'}`}
                                        >
                                            Pistol
                                        </button>
                                        <button
                                            onClick={() => setWeaponType('rifle')}
                                            className={`p-3 rounded-lg font-bold transition-all ${weaponType === 'rifle' ? 'bg-primary-600 text-white ring-2 ring-primary-400' : 'bg-dark-elevated text-dark-muted hover:bg-dark-elevated/80'}`}
                                        >
                                            Rifle
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-dark-muted mb-1">Weapon Name</label>
                                    <input type="text" value={weaponName} onChange={(e) => setWeaponName(e.target.value)} className="input w-full" placeholder="e.g. Steyr LP10" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-dark-muted mb-1">Pellet Name</label>
                                    <input type="text" value={pelletName} onChange={(e) => setPelletName(e.target.value)} className="input w-full" placeholder="e.g. RWS R10" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-dark-muted mb-1">Batch Number</label>
                                    <input type="text" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} className="input w-full" placeholder="Optional" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-dark-muted mb-1">Weight (g)</label>
                                    <input type="text" value={pelletWeight} onChange={(e) => setPelletWeight(e.target.value)} className="input w-full" placeholder="e.g. 0.53" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-dark-muted mb-1">Caliber</label>
                                    <input type="text" value={caliber} onChange={(e) => setCaliber(e.target.value)} className="input w-full" placeholder="e.g. 4.5mm" />
                                </div>

                                <Button
                                    onClick={handleStart}
                                    variant="success"
                                    size="lg"
                                    className="w-full mt-4 py-4 text-xl"
                                >
                                    Start Test
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* History */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-dark-text flex items-center gap-2">
                                <FaHistory className="text-dark-muted" /> Test History
                            </h2>
                        </div>
                        <div className="glass-panel overflow-hidden">
                            <DataTable columns={columns} data={pellets} />
                            {pellets.length === 0 && (
                                <div className="p-12 text-center text-dark-muted">
                                    No tests recorded yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Active Test View
    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen flex flex-col">
            <div className="glass-panel p-6 mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-dark-text mb-1">Testing: {currentPellet}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-dark-muted">
                        <span>Weapon: <strong className="text-dark-text uppercase">{currentTestConfig.weaponName}</strong></span>
                        {currentTestConfig.batchNumber && <span>Batch: <strong className="text-dark-text">{currentTestConfig.batchNumber}</strong></span>}
                        <span>Shots: <strong className="text-dark-text">{testShots.length}</strong></span>
                    </div>
                </div>
                {isCalibrated ? (
                    <div className="text-right">
                        <div className="text-sm text-dark-muted uppercase tracking-widest">Group Radius</div>
                        <div className="text-4xl font-bold text-accent-green">
                            {groupResult} <span className="text-base text-dark-text">mm</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-right animate-pulse">
                        <div className="text-sm text-dark-muted uppercase tracking-widest">Status</div>
                        <div className="text-2xl font-bold text-yellow-500">BLIND TEST ACTIVE</div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Target Section */}
                <div className="flex flex-col">
                    <div className="glass-card flex-1 flex items-center justify-center relative min-h-[500px]">

                        {!isCalibrated ? (
                            /* Blind Mode View */
                            <div className="relative w-[500px] h-[500px] bg-gray-200 rounded-lg flex items-center justify-center border-4 border-black">
                                {/* Black Circle */}
                                <div className="w-64 h-64 bg-black rounded-full flex items-center justify-center">
                                    {testShots.length > 0 && (
                                        /* Red Dot in Middle */
                                        <div
                                            key={testShots.length}
                                            className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-ping-once transition-all"
                                        ></div>
                                    )}
                                </div>
                                <div className="absolute bottom-4 text-black font-bold opacity-50 uppercase tracking-widest">
                                    Target Obscured
                                </div>
                            </div>
                        ) : (
                            /* Calibrated View */
                            <TargetImage
                                shots={displayedShots}
                                size={500}
                                groupRadius={groupResult}
                                groupCenter={{ x: 0, y: 0 }} // Always centered visually after calibration
                                targetType={currentTestConfig.weaponType}
                            />
                        )}
                    </div>

                    <div className="mt-6 flex gap-4">
                        {!isCalibrated ? (
                            <>
                                <Button onClick={handleAddShot} variant="success" className="flex-1 py-4 text-xl">
                                    <FaPlay className="mr-2" /> FIRE SHOT
                                </Button>
                                {testShots.length > 0 && (
                                    <Button onClick={handleCalibrate} variant="primary" className="flex-1 py-4 text-xl">
                                        <FaCrosshairs className="mr-2" /> CALIBRATE
                                    </Button>
                                )}
                            </>
                        ) : (
                            <div className="flex gap-4 w-full">
                                <Button onClick={handleSave} variant="success" className="flex-1 py-4 text-xl">
                                    <FaSave className="mr-2" /> SAVE RESULT
                                </Button>
                                <Button onClick={handleCancel} variant="secondary" className="flex-1 py-4 text-xl">
                                    <FaSync className="mr-2" /> NEW TEST
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shot Log - Only Step Numbers */}
                <div className="glass-panel flex flex-col h-[600px] p-6">
                    <h3 className="text-lg font-semibold text-dark-text mb-4 border-b border-dark-border pb-2">Shot Log</h3>
                    <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                        {testShots.length === 0 && <div className="text-dark-muted text-center py-8">No shots recorded</div>}
                        {testShots.map((shot, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
                            >
                                <span className="text-dark-text font-bold text-lg">Shot #{index + 1}</span>
                                <span className="text-dark-muted text-sm">
                                    {isCalibrated ? `(x: ${shot.x.toFixed(1)}, y: ${shot.y.toFixed(1)})` : 'Recorded'}
                                </span>
                                <FaCheck className="text-accent-green" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
