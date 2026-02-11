"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    return (
        <div className="flex items-center justify-center p-1 bg-zinc-200 dark:bg-zinc-800 rounded-full w-fit group cursor-pointer" onClick={() => setTheme(isDark ? "light" : "dark")}>
            <div className="flex items-center relative gap-4 px-3 py-2">
                {/* Active Indicator Backdrop */}
                <motion.div
                    layout
                    initial={false}
                    animate={{ x: isDark ? "100%" : "0%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-blue-500 rounded-full shadow-lg h-[calc(100%-8px)]"
                />

                <div className="flex items-center gap-2 z-10 w-6 h-6 justify-center">
                    <Sun className={`h-4 w-4 transition-colors duration-300 ${!isDark ? 'text-white' : 'text-zinc-500'}`} />
                </div>
                <div className="flex items-center gap-2 z-10 w-6 h-6 justify-center">
                    <Moon className={`h-4 w-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-zinc-500'}`} />
                </div>
            </div>
        </div>
    )
}
