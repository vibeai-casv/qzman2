import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
    // Generate random particles
    const config = {
        particleCount: 20,
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6'] // Indigo, Violet, Pink, Blue
    };

    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: config.particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            color: config.colors[Math.floor(Math.random() * config.colors.length)],
            duration: Math.random() * 20 + 20, // 20-40s duration
            delay: Math.random() * 10
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* 1. Undulating Gradient Background */}
            <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f172a 100%)',
                }}
            />

            {/* Animated Blobs for Gradient */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 100, 0],
                    y: [0, -50, 0]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [0, -60, 0],
                    x: [0, -100, 0],
                    y: [0, 100, 0]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-900/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 50, -50, 0],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-violet-900/10 rounded-full blur-[80px]"
            />

            {/* 2. Drifting Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        backgroundColor: particle.color,
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -100, 0], // Move up and drifting
                        x: [0, Math.random() * 50 - 25], // Slight horizontal drift
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Overlay Texture for texture/depth */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSAjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-20"></div>
        </div>
    );
};

export default AnimatedBackground;
