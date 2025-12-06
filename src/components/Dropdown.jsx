import React from 'react';

export default function Dropdown({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    className = ''
}) {
    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input cursor-pointer"
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option
                        key={index}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
