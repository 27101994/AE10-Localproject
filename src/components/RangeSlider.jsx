import React from 'react';

export default function RangeSlider({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    className = ''
}) {
    return (
        <div className={`flex flex-col space-y-3 ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">
                        {label}
                    </label>
                    <span className="text-sm font-semibold text-primary-400">
                        {value}
                    </span>
                </div>
            )}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${((value - min) / (max - min)) * 100}%, #1e2330 ${((value - min) / (max - min)) * 100}%, #1e2330 100%)`
                }}
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
}
