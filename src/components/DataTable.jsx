import React from 'react';

export default function DataTable({ columns, data, className = '' }) {
    return (
        <div className={`bg-dark-surface rounded-xl border border-dark-border overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-dark-elevated">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-3 text-xs font-semibold text-gray-400 uppercase ${column.align === 'right' ? 'text-right' :
                                            column.align === 'center' ? 'text-center' : 'text-left'
                                        }`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-dark-elevated transition-colors"
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-4 py-3 text-sm text-gray-200 ${column.align === 'right' ? 'text-right' :
                                                column.align === 'center' ? 'text-center' : 'text-left'
                                            }`}
                                    >
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
