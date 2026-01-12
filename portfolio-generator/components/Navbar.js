'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar({
    user = null,
    navItems = [],
    onLogout,
    showAuthButtons = false,
    logoHref
}) {
    const pathname = usePathname();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isUserMenuOpen || isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen, isMobileMenuOpen]);

    return (
        <nav className="fixed top-3 md:top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-2 md:px-6">
            <div className="glass-nav rounded-full px-3 md:px-8 py-2 md:py-4 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300">
                <div className="flex items-center justify-between">
                    {/* Logo / Brand */}
                    <Link href={logoHref || (user ? "/dashboard" : "/")} className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12 md:w-[100px] md:h-[100px] group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/logo.png"
                                alt="Portify Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-white text-lg md:text-2xl tracking-wide hidden sm:block">Portify</span>
                    </Link>

                    {/* Navigation Items (Center) */}
                    {navItems.length > 0 && (
                        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link key={item.path} href={item.path}>
                                        <div className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${isActive
                                            ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/20 text-white shadow-sm border border-white/10'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}>
                                            <span className="mr-2">{item.icon}</span>
                                            {item.name}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mobile Menu Button */}
                        {navItems.length > 0 && (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        )}

                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 md:gap-3 pl-2 pr-1 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                                >
                                    <span className="text-xs md:text-sm font-medium text-gray-300 hidden sm:block group-hover:text-white">
                                        {user.fullName?.split(' ')[0]}
                                    </span>
                                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg ring-2 ring-white/10">
                                        {user.fullName?.charAt(0) || 'U'}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 top-full mt-4 w-60 bg-[#0f0f13]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-white/5">
                                            <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>

                                        <div className="p-2">
                                            <Link
                                                href={`/portfolio/${user.id}`}
                                                target="_blank"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <span>🌐</span> View Public Portfolio
                                            </Link>
                                        </div>

                                        {user.role === 'admin' && (
                                            <div className="px-2 pb-1 pt-1 border-t border-white/5">
                                                <Link
                                                    href={pathname.startsWith('/admin') ? '/dashboard' : '/admin'}
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors"
                                                >
                                                    <span>🔄</span> {pathname.startsWith('/admin') ? 'Switch to User View' : 'Switch to Admin View'}
                                                </Link>
                                            </div>
                                        )}

                                        <div className="px-2 pb-1 pt-1 border-t border-white/5">
                                            <button
                                                onClick={onLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                                            >
                                                <span>🚪</span> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : showAuthButtons ? (
                            <>
                                <Link href="/login" className="hidden sm:inline-block">
                                    <button className="px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                                        Sign In
                                    </button>
                                </Link>
                                <Link href="/register">
                                    <button className="px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs md:text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 transition-all duration-300">
                                    <span className="hidden sm:inline">Get Started</span>
                                    <span className="sm:hidden">Sign Up</span>
                                    </button>
                                </Link>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {navItems.length > 0 && isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="md:hidden mt-2 glass-card rounded-2xl p-3 border border-white/10 shadow-xl animate-in fade-in slide-in-from-top-5 duration-200"
                >
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/20 text-white shadow-sm border border-white/10'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}>
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {showAuthButtons && (
                        <div className="mt-3 pt-3 border-t border-white/10 sm:hidden">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all mb-2">
                                    Sign In
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
