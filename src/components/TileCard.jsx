import React from 'react';

export default function TileCard({ icon, title, description, onClick, badge }) {
    return (
        <div
            className="tile-card group"
            onClick={onClick}
        >
            <div className="flex flex-col items-center text-center space-y-3">
                {/* Icon with animation */}
                <div className="text-4xl text-primary-400 group-hover:text-primary-300 
                                transition-all duration-300 group-hover:scale-110 
                                group-hover:rotate-3">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
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
