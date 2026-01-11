'use client';

import { Button } from '@/components';

export default function AdminTable({ columns, data, onEdit, onDelete, isLoading, pagination }) {
    if (isLoading) {
        return (
            <div className="w-full glass-card rounded-2xl p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full glass-card rounded-2xl p-12 text-center text-gray-500">
                No records found.
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-300 text-xs uppercase font-medium">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="px-6 py-4 tracking-wider">
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((row, idx) => (
                            <tr
                                key={row.id || row.ID || row.Id || idx}
                                className="hover:bg-white/5 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(row)}
                                        className="p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onDelete(row)}
                                        className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="p-4 border-t border-white/5 flex justify-between items-center bg-white/5">
                    <div className="text-sm text-gray-400">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-1 text-sm rounded-lg bg-white/5 disabled:opacity-50 hover:bg-white/10 text-gray-300 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-3 py-1 text-sm rounded-lg bg-white/5 disabled:opacity-50 hover:bg-white/10 text-gray-300 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
