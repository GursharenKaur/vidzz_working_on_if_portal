"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "group relative overflow-hidden rounded-[32px] transition-all duration-500",
                "bg-(--glass-background) backdrop-blur-md",
                "border border-(--glass-border)",
                "shadow-[0_8px_32px_0_rgba(var(--surface-shadow))]",
                className
            )}
        >
            {children}
        </motion.div>
    )
}
