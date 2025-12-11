import React, { useState, useMemo } from 'react';
import { usePelletStore } from '@store/pelletStore';
import TargetImage from '@components/TargetImage';
import Button from '@components/Button';
import DataTable from '@components/DataTable';
import { generateDummyShot, calculateGroupCenter } from '@utils/shootingUtils';
import { FaBullseye, FaCheck, FaSave, FaSync, FaCircle, FaHistory, FaCrosshairs, FaTrash, FaEdit } from 'react-icons/fa';

export default function PelletTester() {
    const {
        pellets,
        currentPellet,
        testShots,
        maxShots,
        weaponType,
        startPelletTest,
        addTestShot,
        savePelletTest,
        resetPelletTest,
    } = usePelletStore();

    // Local State
    const [pelletName, setPelletName] = useState('');
    const [numShots, setNumShots] = useState(5);
    const [weapon, setWeapon] = useState('pistol');
    const [isCalibrated, setIsCalibrated] = useState(false);

    // Derived Shots for Display
    const displayedShots = useMemo(() => {
        if (!isCalibrated) return []; // Blind shots - show nothing

        // Calibration: Center the group on the bullseye
        const center = calculateGroupCenter(testShots);
        // Target center is 0,0 in our coordinate system logic (relative to center)
        // Actually TargetImage assumes shots have x,y relative to center?
        // Let's check shootingUtils. generateDummyShot uses x,y relative to center (0,0).
        // TargetImage: cx={centerX + shot.x}, cy={centerY - shot.y}. 
        // So shot.x, shot.y are relative offsets.

        // To center the group:
        // NewX = ShotX - GroupCenterX
        // NewY = ShotY - GroupCenterY
        return testShots.map(shot => ({
            ...shot,
            x: shot.x - center.x,
            y: shot.y - center.y,
        }));
    }, [testShots, isCalibrated]);

    const handleStart = () => {
        if (pelletName.trim()) {
            startPelletTest(pelletName, numShots, weapon);
            setIsCalibrated(false);
        }
    };

    const handleAddShot = () => {
        if (testShots.length < maxShots) {
            const shot = generateDummyShot(testShots.length + 1);
            addTestShot(shot);
        }
    };

    const handleCalibrate = () => {
        setIsCalibrated(true);
    };

    const handleSave = () => {
        savePelletTest();
        setPelletName('');
        alert('Pellet test saved!');
    };

    const handleCancel = () => {
        if (window.confirm("Cancel current test?")) {
            resetPelletTest();
        }
    }

    const columns = [
        { key: 'index', label: 'SL', render: (_, row, index) => index + 1 },
        { key: 'pelletName', label: 'Pellet Name', align: 'left' },
        { key: 'groupDiameter', label: 'Group Dia', align: 'right', render: (value) => <span className="text-accent-green font-bold">{value} mm</span> },
        { key: 'weaponType', label: 'Weapon', align: 'center', render: (val) => <span className="uppercase text-xs font-bold px-2 py-1 rounded bg-dark-elevated">{val}</span> },
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
                <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">Pellet Tester</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Setup Form */}
                    <div className="lg:col-span-1">
                        <div className="card-elevated sticky top-6">
                            <h2 className="text-xl font-bold text-accent-purple mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-accent-purple rounded-full"></span>
                                New Pellet Test
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Pellet Name</label>
                                    <input
                                        type="text"
                                        value={pelletName}
                                        onChange={(e) => setPelletName(e.target.value)}
                                        className="input w-full"
                                        placeholder="e.g., RWS Meisterkugeln"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Number of Shots</label>
                                    <input
                                        type="number"
                                        value={numShots}
                                        onChange={(e) => setNumShots(Number(e.target.value))}
                                        className="input w-full"
                                        min="3" max="50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Weapon Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setWeapon('pistol')}
                                            className={`p-3 rounded-lg font-bold transition-all ${weapon === 'pistol' ? 'bg-primary-600 text-white ring-2 ring-primary-400' : 'bg-dark-elevated text-gray-400 hover:bg-dark-elevated/80'}`}
                                        >
                                            Pistol
                                        </button>
                                        <button
                                            onClick={() => setWeapon('rifle')}
                                            className={`p-3 rounded-lg font-bold transition-all ${weapon === 'rifle' ? 'bg-primary-600 text-white ring-2 ring-primary-400' : 'bg-dark-elevated text-gray-400 hover:bg-dark-elevated/80'}`}
                                        >
                                            Rifle
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleStart}
                                    disabled={!pelletName.trim()}
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
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FaHistory className="text-gray-500" /> Test History
                            </h2>
                        </div>
                        <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
                            <DataTable columns={columns} data={pellets} />
                            {pellets.length === 0 && (
                                <div className="p-12 text-center text-gray-500">
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
            <div className="bg-dark-surface p-6 rounded-xl border border-dark-border mb-6 flex justify-between items-center shadow-lg">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Testing: {currentPellet}</h2>
                    <div className="flex gap-4 text-sm text-gray-400">
                        <span>Weapon: <strong className="text-white uppercase">{weaponType}</strong></span>
                        <span>Shots: <strong className="text-white">{testShots.length} / {maxShots}</strong></span>
                    </div>
                </div>
                {isCalibrated && (
                    <div className="text-right animate-fade-in-up">
                        <div className="text-sm text-gray-500 uppercase tracking-widest">Group Status</div>
                        <div className="text-2xl font-bold text-accent-green">CALIBRATED <FaCheck className="inline ml-2" /></div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Target Section */}
                <div className="flex flex-col">
                    <div className="card flex-1 flex items-center justify-center bg-dark-bg/50 backdrop-blur relative">
                        {/* Overlay text for blind mode */}
                        {!isCalibrated && testShots.length > 0 && (
                            <div className="absolute top-4 left-0 right-0 text-center z-20">
                                <span className="bg-dark-surface/90 text-white px-4 py-2 rounded-full border border-dark-border shadow-lg font-bold tracking-widest text-sm">
                                    BLIND MODE ACTIVE
                                </span>
                            </div>
                        )}

                        <TargetImage
                            shots={displayedShots}
                            size={500}
                        // If blind (not calibrated), maybe hide rings? 
                        // Req: "target will become visible" after calibrate.
                        // So pass simpleMode={!isCalibrated} but WITHOUT shots? Or just hide TargetImage completely and show blank?
                        // Let's hide rings by passing empty rings if not calibrated?
                        // TargetImage doesn't accept rings prop. 
                        // I'll assume standard target is visible but shots are hidden (handled by displayedShots=[]).
                        // Wait, "target will become visible" -> means target IS invisible before.
                        // I'll render a placeholder box if !isCalibrated which says "Target Hidden" or just blank paper.
                        // Actually, let's just use `simpleMode` effectively or overlay.
                        />

                        {!isCalibrated && (
                            <div className="absolute inset-0 bg-[#F5E6CA] z-10 flex items-center justify-center opacity-90 rounded-xl border-4 border-black">
                                <div className="text-center">
                                    <FaCrosshairs className="text-6xl text-gray-400 mb-4 mx-auto opacity-50" />
                                    <p className="text-black font-bold opacity-50">TARGET OBSCURED</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex gap-4">
                        {testShots.length < maxShots ? (
                            <Button onClick={handleAddShot} className="w-full py-4 text-xl">
                                <span className="flex items-center justify-center"><FaBullseye className="mr-2" /> FIRE BLIND SHOT ({maxShots - testShots.length} left)</span>
                            </Button>
                        ) : !isCalibrated ? (
                            <Button onClick={handleCalibrate} variant="primary" className="w-full py-4 text-xl animate-pulse">
                                <span className="flex items-center justify-center"><FaCrosshairs className="mr-2" /> CALIBRATE & REVEAL</span>
                            </Button>
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

                {/* Shot List */}
                <div className="card flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-white/10 pb-2">Shot Log</h3>
                    <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                        {testShots.map((shot, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
                            >
                                <span className="text-white font-bold">Shot #{index + 1}</span>
                                <span className="text-gray-400 text-sm">Recorded</span>
                                {/* Hide values until calibrated? usually yes for blind test */}
                                <span className="font-mono text-primary-400">
                                    {isCalibrated ? shot.score : '???'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
