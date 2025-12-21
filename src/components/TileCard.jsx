import React from 'react';

export default function TileCard({ icon, title, description, onClick, badge }) {
    return (
        <div
            className="group relative overflow-hidden rounded-2xl p-6 cursor-pointer glass-card hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:border-2 hover:border-primary-600 dark:hover:border-primary-500/30 transition-all duration-500"
            onClick={onClick}
        >
            {/* Background Gradient Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/25 via-blue-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                {/* Icon with animation */}
                <div className="text-4xl text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 
                                transition-all duration-300 group-hover:scale-110 
                                group-hover:rotate-6">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-dark-text group-hover:text-primary-600 dark:group-hover:text-white transition-colors">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-dark-muted group-hover:text-dark-text/80 dark:group-hover:text-gray-300 transition-colors">
                        {description}
                    </p>
                )}

                {/* Badge with enhanced styling */}
                {badge && (
                    <span className="badge badge-primary">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}
