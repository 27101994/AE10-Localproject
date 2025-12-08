import React from 'react';
import { FaTrophy } from 'react-icons/fa';

export default function Competition() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Competition Mode</h1>
                <p className="text-gray-400">Official competition information</p>
            </div>

            {/* Competition poster */}
            <div className="card-elevated">
                <div className="text-center space-y-6 py-8">
                    <div className="flex justify-center mb-4">
                        <FaTrophy className="text-6xl" />
                    </div>

                    <h2 className="text-3xl font-bold text-gradient">
                        Official Competition
                    </h2>

                    <div className="max-w-md mx-auto space-y-4 text-left">
                        <div className="flex justify-between border-b border-dark-border pb-2">
                            <span className="text-gray-500">Event:</span>
                            <span className="text-gray-200 font-semibold">10m Air Pistol Championship</span>
                        </div>

                        <div className="flex justify-between border-b border-dark-border pb-2">
                            <span className="text-gray-500">Date:</span>
                            <span className="text-gray-200 font-semibold">December 15, 2024</span>
                        </div>

                        <div className="flex justify-between border-b border-dark-border pb-2">
                            <span className="text-gray-500">Location:</span>
                            <span className="text-gray-200 font-semibold">National Shooting Range</span>
                        </div>

                        <div className="flex justify-between border-b border-dark-border pb-2">
                            <span className="text-gray-500">Category:</span>
                            <span className="text-gray-200 font-semibold">Senior Men</span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <p className="text-sm text-gray-500">
                            More details will be provided by the organizers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
