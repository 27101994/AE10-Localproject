import React from 'react';

export default function TimerIndicator({ isRunning, showLabel = true }) {
    return (
        <div
            className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-lg
                border transition-all duration-200
                ${isRunning
                    ? 'bg-yellow-600/10 border-yellow-600 text-yellow-600 dark:bg-accent-yellow/10 dark:border-accent-yellow dark:text-accent-yellow'
                    : 'bg-black/5 border-dark-border text-dark-muted dark:bg-gray-600/10'
                }
            `}
            title={isRunning ? 'Timer Running' : 'Timer Stopped'}
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showLabel && (
                <span className="text-xs font-medium">
                    {isRunning ? 'Timer Active' : 'Timer Stopped'}
                </span>
            )}
        </div>
    );
}
