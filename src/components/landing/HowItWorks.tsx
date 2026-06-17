import { motion } from 'framer-motion';
import { OrnamentDivider } from '@/components/icons';
import { steps } from '@/data/landing.data';

export default function HowItWorks() {
    return (
        <section id="processus" className="relative py-32 sm:py-40 px-6">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <span className="text-xs uppercase tracking-[0.3em] text-[#d4b96a] font-medium">
                        Processus
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-[#fafafa] mt-6 mb-8">
                        En trois étapes
                    </h2>
                    <OrnamentDivider className="mt-10" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                    {steps.map((item, i) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="relative text-center md:text-left"
                        >
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[calc(100%-1rem)] w-[calc(100%-2rem)] h-px bg-[rgba(255,255,255,0.06)]" />
                            )}

                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] mb-6">
                                <item.icon className="w-5 h-5 text-[#d4b96a]" strokeWidth={1.5} />
                            </div>

                            <div className="text-xs text-[#d4b96a] uppercase tracking-widest mb-3">
                                Étape {item.step}
                            </div>

                            <h3 className="font-display text-xl sm:text-2xl font-light text-[#fafafa] mb-3">
                                {item.title}
                            </h3>

                            <p className="text-sm text-[#a1a1aa] leading-relaxed max-w-xs mx-auto md:mx-0">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
