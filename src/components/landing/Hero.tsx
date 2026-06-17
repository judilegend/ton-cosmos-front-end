import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { ZodiacWheel } from '@/components/icons';
import StarField from './StarField';

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
        >
            <StarField />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                    className="opacity-30"
                >
                    <ZodiacWheel className="w-125 h-125 sm:w-175 sm:h-175" />
                </motion.div>
            </div>

            {/* Subtle radial glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[rgba(212,185,106,0.08)] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-10 text-[#d4b96a] flex items-center justify-center gap-x-2.5"
                >
                    <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                    <span className="inline-block text-xs uppercase tracking-[0.3em] font-medium">
                        Par Indira — Astrologie IA
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#fafafa] leading-[0.95] mb-8"
                >
                    Découvre ton
                    <br />
                    <span className="italic text-[#d4b96a]">Thème Astral</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-base sm:text-lg text-[#a1a1aa] max-w-xl mx-auto mb-12 leading-relaxed"
                >
                    Un rapport astrologique personnalisé généré par intelligence artificielle.
                    Comprends ta nature profonde, tes enjeux amoureux et ta mission de vie en 40
                    pages premium.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="#commander"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-[#d4b96a] text-[#09090b] text-sm font-medium tracking-wide rounded-full hover:bg-[#dec87e] transition-all duration-300"
                    >
                        Commander mon rapport
                        <svg
                            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                            viewBox="0 0 16 16"
                            fill="none"
                        >
                            <path
                                d="M3 8H13M13 8L9 4M13 8L9 12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                    <a
                        href="#contenu"
                        className="inline-flex items-center gap-2 px-8 py-4 text-[#a1a1aa] text-sm tracking-wide hover:text-[#fafafa] transition-colors duration-300"
                    >
                        Découvrir le contenu
                    </a>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex items-center justify-center gap-12 sm:gap-16 mt-20 text-center"
                >
                    {[
                        { value: '40-60', label: 'pages' },
                        { value: '< 5 min', label: 'génération' },
                        { value: '100%', label: 'personnalisé' },
                    ].map((stat, i) => (
                        <div key={stat.label} className="relative">
                            <div className="font-display text-2xl sm:text-3xl font-light text-[#fafafa]">
                                {stat.value}
                            </div>
                            <div className="text-xs text-[#52525b] tracking-wider uppercase mt-1">
                                {stat.label}
                            </div>
                            {i < 2 && (
                                <div className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 w-px h-8 bg-[rgba(255,255,255,0.04)]" />
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-15 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ChevronDown size={32} className="text-[#52525b]" />
                </motion.div>
            </motion.div>
        </section>
    );
}
