'use client'
import { useEffect, useState } from 'react'

export default function Loading() {
    const [showLoading, setShowLoading] = useState(true)

    useEffect(() => {
        // Minimum loading time of 800ms
        const timer = setTimeout(() => {
            setShowLoading(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    if (!showLoading) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">

                {/* Main loading animation */}
                <div className="relative">
                    {/* Outer ring */}
                    <div className="w-20 h-20 rounded-full border-2 border-zinc-200 dark:border-zinc-800"></div>

                    {/* Spinning ring */}
                    <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-transparent border-t-zinc-800 dark:border-t-zinc-200 animate-spin"></div>

                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-zinc-400/10 via-transparent to-zinc-400/10 dark:from-zinc-600/10 dark:to-zinc-600/10 animate-pulse"></div>
                </div>

                {/* App name */}
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-wide">
                        Spliter
                    </h1>
                </div>

            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50/50 via-transparent to-transparent dark:from-zinc-900/50"></div>
        </div>
    )
}