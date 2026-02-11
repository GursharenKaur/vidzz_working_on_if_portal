"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function GlobalLoading() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                }}
                className="relative mb-8 h-24 w-24"
            >
                <Image
                    src="/favicon.ico"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
                <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
            </motion.div>

            <div className="w-64">
                <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                    />
                </div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 text-center text-sm font-medium tracking-widest text-zinc-500 uppercase"
                >
                    Preparing your dashboard...
                </motion.p>
            </div>
        </motion.div>
    )
}
