"use client"

import { motion } from "framer-motion"

interface TextRevealProps {
    text: string
    className?: string
    glowWords?: string[]
}

export function TextReveal({ text, className = "", glowWords = [] }: TextRevealProps) {
    const words = text.split(" ")

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    }

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className={`flex flex-wrap justify-center ${className}`}
        >
            {words.map((word, index) => {
                const isGlow = glowWords.includes(word.replace(/[^a-zA-Z]/g, ""))
                return (
                    <motion.span
                        variants={child}
                        key={index}
                        className={`mr-2 last:mr-0 ${isGlow ? "text-cyan-400 text-glow font-bold" : "text-white"
                            }`}
                    >
                        {word}
                    </motion.span>
                )
            })}
        </motion.div>
    )
}
