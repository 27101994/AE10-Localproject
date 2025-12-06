import React from 'react';
import { formatDate } from '@utils/dateUtils';

export default function DateGroup({ date, events, onEventClick }) {
    return (
        <div className="mb-8">
            {/* Date Header */}
            <div className="sticky top-0 bg-dark-bg/95 backdrop-blur-sm z-10 py-3 mb-4">
                <h2 className="text-xl font-bold text-gray-100">{date}</h2>
                <div className="h-0.5 bg-gradient-to-r from-primary-500 to-transparent mt-2"></div>
            </div>

            {/* Event Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="card cursor-pointer hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-100 mb-1 truncate">
                                    {event.matchName}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {new Date(event.savedAt).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="text-2xl">🎯</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-dark-elevated rounded p-2">
                                <div className="text-xs text-gray-500 mb-1">Shots</div>
                                <div className="font-bold text-primary-400">{event.shots?.length || 0}</div>
                            </div>
                            <div className="bg-dark-elevated rounded p-2">
                                <div className="text-xs text-gray-500 mb-1">Score</div>
                                <div className="font-bold text-accent-green">{event.totalScore || 0}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
