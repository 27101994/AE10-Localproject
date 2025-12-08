import React from 'react';
import { FaRegDotCircle, FaBullseye, FaCheck } from 'react-icons/fa';

export default function EventCard({ event, onSelect, selected }) {
    return (
        <div
            onClick={() => onSelect(event.id)}
            className={`card cursor-pointer transition-all duration-300 transform hover:scale-105 ${selected === event.id
                ? 'border-primary-500 bg-dark-elevated shadow-xl'
                : 'border-dark-border hover:border-primary-500/50'
                }`}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-100 mb-1">
                        {event.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {event.type === 'pistol' ? <span className="flex items-center gap-2"><FaRegDotCircle /> Pistol</span> : <span className="flex items-center gap-2"><FaBullseye /> Rifle</span>}
                    </p>
                </div>

                {selected === event.id && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm"><FaCheck /></span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                <div className="text-sm text-gray-400">
                    {event.shots ? `${event.shots} shots` : 'Free series'}
                </div>
                <div className="text-xs text-primary-400 font-medium">
                    Sighter + Match
                </div>
            </div>
        </div>
    );
}
