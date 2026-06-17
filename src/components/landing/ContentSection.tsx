import { motion } from 'framer-motion';
import { OrnamentDivider } from '@/components/icons';
import { sept_dimensions } from '@/data/landing.data';

export default function ContentSection() {
    return (
        <section id="contenu" className="backdrop-blur-lg relative py-32 sm:py-40 px-6">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <span className="text-xs uppercase tracking-[0.3em] text-[#d4b96a] font-medium">
                        Contenu du rapport
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-[#fafafa] mt-6 mb-8">
                        Cinq dimensions
                        <br />
                        <span className="italic">de ton être</span>
                    </h2>
                    <p className="text-[#a1a1aa] max-w-lg mx-auto text-base leading-relaxed">
                        Chaque rapport est unique. Chaque analyse référence tes placements
                        planétaires spécifiques. Aucune généralité.
                    </p>
                    <OrnamentDivider className="mt-10" />
                </motion.div>

                <div className="space-y-4">
                    {sept_dimensions.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="group relative rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-8 sm:p-10 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(212,185,106,0.25)] transition-all duration-500">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10">
                                    {/* Number & Icon */}
                                    <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-4">
                                        <span className="font-display text-5xl sm:text-6xl font-extralight text-[#52525b] group-hover:text-[#d4b96a]/20 transition-colors duration-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div className="w-12 h-12 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center group-hover:border-[#d4b96a]/30 transition-all duration-500">
                                            <section.icon
                                                className="w-5 h-5 text-[#d4b96a]"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-display text-2xl sm:text-3xl font-light text-[#fafafa] mb-3">
                                            {section.title}
                                        </h3>
                                        <p className="text-[#a1a1aa] text-base leading-relaxed mb-5 max-w-xl">
                                            {section.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {section.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] text-[#71717a] bg-[rgba(255,255,255,0.02)] uppercase tracking-wider"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
