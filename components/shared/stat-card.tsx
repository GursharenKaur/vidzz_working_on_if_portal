"use client"

import { motion, useSpring, useTransform } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { useEffect } from "react"

interface StatCardProps {
    icon: LucideIcon
    label: string
    value: number
    loading?: boolean
    delay?: number
    color?: string
}

function AnimatedNumber({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 1, stiffness: 100, damping: 20 })
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

    useEffect(() => {
        spring.set(value)
    }, [value, spring])

    return <motion.span>{display}</motion.span>
}

export function StatCard({ icon: Icon, label, value, loading, delay = 0, color = "cyan" }: StatCardProps) {
    const colorMap: Record<string, string> = {
        cyan: "text-cyan-400 bg-cyan-400/10",
        purple: "text-purple-400 bg-purple-400/10",
        emerald: "text-emerald-400 bg-emerald-400/10",
        rose: "text-rose-400 bg-rose-400/10",
    }

    const selectedColor = colorMap[color] || colorMap.cyan

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-xl transition-colors hover:bg-muted/50"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-foreground">
                            {loading ? (
                                <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                            ) : (
                                <AnimatedNumber value={value} />
                            )}
                        </h3>
                    </div>
                </div>
                <div className={`rounded-xl p-3 ${selectedColor} transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
        </motion.div>
    )
}
