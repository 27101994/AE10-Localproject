import React, { useState } from 'react';
import { usePelletStore } from '@store/pelletStore';
import TargetImage from '@components/TargetImage';
import Button from '@components/Button';
import DataTable from '@components/DataTable';
import { generateDummyShot } from '@utils/shootingUtils';
import { FaBullseye, FaCheck, FaSave, FaSync, FaCircle } from 'react-icons/fa';

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

    const [pelletName, setPelletName] = useState('');
    const [numShots, setNumShots] = useState(5);
    const [weapon, setWeapon] = useState('pistol');

    const handleStart = () => {
        if (pelletName.trim()) {
            startPelletTest(pelletName, numShots, weapon);
        }
    };

    const handleAddShot = () => {
        if (testShots.length < maxShots) {
            const shot = generateDummyShot(testShots.length + 1);
            addTestShot(shot);
        }
    };

    const handleSave = () => {
        savePelletTest();
        setPelletName('');
        alert('Pellet test saved!');
    };

    const columns = [
        { header: 'SL', key: 'index', align: 'center', render: (_, row, index) => index + 1 },
        { header: 'Pellet Name', key: 'pelletName', align: 'left' },
        { header: 'Group Diameter', key: 'groupDiameter', align: 'right', render: (value) => `${value} mm` },
        { header: 'Weapon', key: 'weaponType', align: 'center' },
    ];

    const pelletData = pellets.map(p => ({
        pelletName: p.pelletName,
        groupDiameter: p.groupDiameter,
        weaponType: p.weaponType,
    }));

    if (!currentPellet) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">Pellet Tester</h1>
                    <p className="text-gray-400">Compare different pellet performance</p>
                </div>

                <div className="card-elevated mb-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Pellet Name
                            </label>
                            <input
                                type="text"
                                value={pelletName}
                                onChange={(e) => setPelletName(e.target.value)}
                                className="input w-full"
                                placeholder="e.g., RWS Meisterkugeln"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Number of Shots
                            </label>
                            <input
                                type="number"
                                value={numShots}
                                onChange={(e) => setNumShots(Number(e.target.value))}
                                className="input w-full"
                                min="3"
                                max="10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Weapon Type
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="pistol"
                                        checked={weapon === 'pistol'}
                                        onChange={(e) => setWeapon(e.target.value)}
                                        className="text-primary-600"
                                    />
                                    <span className="text-gray-300">Pistol</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="rifle"
                                        checked={weapon === 'rifle'}
                                        onChange={(e) => setWeapon(e.target.value)}
                                        className="text-primary-600"
                                    />
                                    <span className="text-gray-300">Rifle</span>
                                </label>
                            </div>
                        </div>

                        <Button
                            onClick={handleStart}
                            disabled={!pelletName.trim()}
                            className="w-full"
                        >
                            Start Test
                        </Button>
                    </div>
                </div>

                {/* Previous tests */}
                {pellets.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Previous Tests</h2>
                        <DataTable columns={columns} data={pelletData} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-100">Pellet Tester</h1>
                <p className="text-gray-400 mt-1 flex items-center">
                    Testing: {currentPellet} <FaCircle className="mx-2 text-[0.5em]" /> {testShots.length} / {maxShots} shots
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left - Target */}
                <div className="space-y-4">
                    <div className="card">
                        <TargetImage shots={testShots} size={500} />
                    </div>

                    {testShots.length < maxShots ? (
                        <Button onClick={handleAddShot} className="w-full">
                            <span className="flex items-center justify-center"><FaBullseye className="mr-2" /> Shoot (Demo) - {maxShots - testShots.length} remaining</span>
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <div className="card text-center py-4 bg-accent-green/20 border-accent-green">
                                <p className="text-accent-green font-semibold flex items-center justify-center"><FaCheck className="mr-2" /> Test Complete</p>
                            </div>
                            <div className="flex space-x-3">
                                <Button variant="success" onClick={handleSave} className="flex-1">
                                    <span className="flex items-center justify-center"><FaSave className="mr-2" /> Save Test</span>
                                </Button>
                                <Button variant="secondary" onClick={resetPelletTest} className="flex-1">
                                    <span className="flex items-center justify-center"><FaSync className="mr-2" /> New Test</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right - Shot list */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Shots</h3>
                    <div className="space-y-2">
                        {testShots.map((shot, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
                            >
                                <span className="text-gray-400">Shot {shot.id}</span>
                                <span className="font-semibold text-primary-400">Score: {shot.score}</span>
                            </div>
                        ))}

                        {testShots.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No shots yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
