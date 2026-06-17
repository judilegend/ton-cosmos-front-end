import { useState } from 'react';
import { motion } from 'framer-motion';
import { OrnamentDivider } from '@/components/icons';
import BirthForm, { type PayloadBirthForm } from '@/components/landing/form/BirthForm';

export default function OrderForm({
    onNextStep,
}: {
    onNextStep: (data: PayloadBirthForm) => void;
}) {
    const [userData, setUserData] = useState<PayloadBirthForm>({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        birthTime: '',
        birthCity: '',
        latitude: 48.85968932107463,
        longitude: 2.3469543457031254,
        birthTimeUnknown: false,
    });

    const handleSubmit = (data: PayloadBirthForm) => {
        setUserData(data);
        onNextStep(data);
    };

    return (
        <section id="commander" className="relative backdrop-blur-lg py-32 sm:py-40 px-6">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <span className="text-xs uppercase tracking-[0.3em] text-[#d4b96a] font-medium">
                        Commander
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-[#fafafa] mt-6 mb-8">
                        Ton rapport en
                        <br />
                        <span className="italic">deux minutes</span>
                    </h2>
                    <OrnamentDivider className="mt-10" />
                </motion.div>

                <motion.div
                    key="birth"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <BirthForm initialData={userData} onNextStep={handleSubmit} />
                </motion.div>
            </div>
        </section>
    );
}
