'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EmptyState({
    title = "Nothing here yet",
    description = "Create your first item to get started.",
    actionLabel,
    onAction,
    actionLink,
    icon = "✨"
}) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white/5 border border-white/5 min-h-[400px]">
            <div className="w-20 h-20 bg-gradient-to-tr from-rose-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-4xl animate-[bounce_3s_infinite]">
                {icon}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                {description}
            </p>

            {actionLabel && (
                actionLink ? (
                    <Link href={actionLink}>
                        <button className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 transition-all duration-300">
                            {actionLabel}
                        </button>
                    </Link>
                ) : (
                    <button
                        onClick={onAction}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 transition-all duration-300"
                    >
                        {actionLabel}
                    </button>
                )
            )}
        </div>
    );
}
