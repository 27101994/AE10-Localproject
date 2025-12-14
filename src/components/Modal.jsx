import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-panel rounded-xl border border-dark-border 
                            shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto
                            animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-border">
                    <h2 className="text-xl font-semibold text-dark-text">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-dark-muted hover:text-dark-text transition-all duration-200
                                   hover:scale-110 hover:rotate-90 p-1 rounded-lg
                                   hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
