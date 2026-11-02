'use client';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
export default function PageEntrance({ children }: { children: ReactNode }) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}
