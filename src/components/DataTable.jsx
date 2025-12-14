import React from 'react';

export default function DataTable({ columns, data, className = '' }) {
    return (
        <div className={`glass-panel rounded-xl border border-dark-border overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-black/5 dark:bg-dark-elevated">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-3 text-xs font-semibold text-dark-muted uppercase ${column.align === 'right' ? 'text-right' :
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
                                className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-4 py-3 text-sm text-dark-text ${column.align === 'right' ? 'text-right' :
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
