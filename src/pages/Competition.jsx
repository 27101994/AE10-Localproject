import React from 'react';
import { FaTrophy } from 'react-icons/fa';

export default function Competition() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-text mb-2">Competition Mode</h1>
                <p className="text-dark-muted">Official competition information</p>
            </div>

            {/* Competition poster */}
            <div className="glass-card p-8">
                <div className="text-center space-y-6">
                    <div className="flex justify-center mb-4">
                        <FaTrophy className="text-4xl text-primary-500" />
                    </div>

                    <h2 className="text-3xl font-bold text-gradient">
                        Official Competition
                    </h2>

                    <div className="max-w-md mx-auto space-y-4 text-left">
                        <div className="flex justify-between border-b border-dark-border pb-2">
                            <span className="text-dark-muted">Event:</span>
                            <span className="text-dark-text font-semibold">10m Air Pistol Championship</span>
                        </div>

                        <div className="flex justify-between border-b border-dark-border pb-2">
                            <span className="text-dark-muted">Date:</span>
                            <span className="text-dark-text font-semibold">December 15, 2024</span>
                        </div>

                        <div className="flex justify-between border-b border-dark-border pb-2">
                            <span className="text-dark-muted">Location:</span>
                            <span className="text-dark-text font-semibold">National Shooting Range</span>
                        </div>

                        <div className="flex justify-between border-b border-dark-border pb-2">
                            <span className="text-dark-muted">Category:</span>
                            <span className="text-dark-text font-semibold">Senior Men</span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <p className="text-sm text-dark-muted">
                            More details will be provided by the organizers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
