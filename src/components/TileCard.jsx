import React from 'react';

export default function TileCard({ icon, title, description, onClick, badge }) {
    return (
        <div
            className="tile-card group"
            onClick={onClick}
        >
            <div className="flex flex-col items-center text-center space-y-3">
                {/* Icon */}
                <div className="text-4xl text-primary-400 group-hover:text-primary-300 transition-colors">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-100">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-400">
                        {description}
                    </p>
                )}

                {/* Badge */}
                {badge && (
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}
