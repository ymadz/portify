'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

// Searchable Select component for User selection
export default function SearchableSelect({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Search...',
    className = '',
    required = false,
    error
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Find selected option label
    const selectedOption = options.find(opt => opt.value === value);

    // Filter options based on search query
    // STRICTY LIMIT TO 5 ITEMS as requested
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options.slice(0, 5);
        return options
            .filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 5);
    }, [options, searchQuery]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div className="w-full relative" ref={wrapperRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}

            <div
                className={`
                    w-full rounded-2xl border bg-white/5 text-gray-100 
                    ${error
                        ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500'
                        : 'border-white/10 focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-transparent hover:border-white/20'
                    }
                    transition-all
                    cursor-pointer
                    ${className}
                `}
                onClick={() => {
                    setIsOpen(true);
                    if (inputRef.current) inputRef.current.focus();
                }}
            >
                <div className="px-4 py-3 flex items-center justify-between">
                    {isOpen ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={placeholder}
                            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className={selectedOption ? 'text-gray-200' : 'text-gray-500'}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    )}
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(option);
                                    }}
                                    className={`
                                        px-4 py-3 text-sm cursor-pointer transition-colors
                                        ${value === option.value ? 'bg-rose-500/20 text-rose-400' : 'text-gray-300 hover:bg-white/5'}
                                    `}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
