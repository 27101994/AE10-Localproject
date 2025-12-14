import React from 'react';
import { FaRegDotCircle, FaBullseye, FaCheck } from 'react-icons/fa';

export default function EventCard({ event, onSelect, selected }) {
    return (
        <div
            onClick={() => onSelect(event.id)}
            className={`cursor-pointer transition-all duration-300 transform rounded-xl border p-4 hover:scale-[1.02] ${selected === event.id
                ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'glass-card hover:border-primary-500/50'
                }`}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-dark-text mb-1">
                        {event.name}
                    </h3>
                    <p className="text-sm text-dark-muted">
                        {event.type === 'pistol' ? <span className="flex items-center gap-2"><FaRegDotCircle /> Pistol</span> : <span className="flex items-center gap-2"><FaBullseye /> Rifle</span>}
                    </p>
                </div>

                {selected === event.id && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm"><FaCheck /></span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dark-border mt-4">
                <div className="text-sm text-dark-muted font-medium">
                    {event.shots ? `${event.shots} shots` : 'Free series'}
                </div>
                <div className="text-xs text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase bg-primary-500/10 px-2 py-1 rounded">
                    Sighter + Match
                </div>
            </div>
        </div>
    );
}
