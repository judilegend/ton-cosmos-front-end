import { motion } from 'framer-motion';
import Footer from '@/components/landing/Footer';
import HeaderSection from '@/components/landing/Header';
import { Loader2, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrnamentDivider } from '@/components/icons';
import { CHECK_STRIPE_SESSION_ENDPOINT, useApi } from '@/hooks/UseApi';
import { plans } from '@/data/landing.data';
import ScrollToTop from '@/components/ScrollToTop';

const navLinks = [
    { label: 'Accueil', href: '/landing#hero' },
    { label: 'Contenu', href: '/landing#contenu' },
    { label: 'Processus', href: '/landing#processus' },
    { label: 'Commander', href: '/landing#commander' },
];

interface CheckSessionResponse {
    checkout_url: string;
    session_id: string;
}

type PaymentData = {
    email: string;
    full_name: string;
    birth_date: string;
    birth_time_unknown: string;
    birth_time: string;
    birth_city: string;
    selected_plan: 'essentiel' | 'complet' | 'annee_cosmique' | 'cosmos_integral';
    price: number;
    amount_total: number;
    order_id: number;
};

export default function PayementPage() {
    const navigate = useNavigate();
    const getStoredPayment = (): PaymentData | null => {
        const stored = sessionStorage.getItem('paymentData');
        return stored ? JSON.parse(stored) : null;
    };

    const [paymentData] = useState<PaymentData | null>(getStoredPayment);

    const [processing, setprocessing] = useState(false);
    const { request } = useApi<CheckSessionResponse>();

    useEffect(() => {
        if (!paymentData) {
            navigate('/landing', { replace: true });
        }
    }, [paymentData, navigate]);

    const basePrice = paymentData ? (plans[paymentData.selected_plan]?.price || '0') : '0';
    const totalPrice = basePrice;

    const onSubmit = async () => {
        if (!paymentData) return;

        setprocessing(true);

        const payload = {
            plan_type: paymentData.selected_plan,
            email: paymentData.email,
            order_id: paymentData.order_id,
            amount_total: paymentData.amount_total,
            has_audio: false,
            has_poster: false,
        };

        try {
            const response = await request(CHECK_STRIPE_SESSION_ENDPOINT, {
                method: 'POST',
                body: payload,
            });
            if (response?.success) {
                window.location.href = response.data.checkout_url;
            } else {
                console.log(response?.message);
            }
        } catch (err: unknown) {
            console.log(err);
        } finally {
            setprocessing(false);
        }
    };

    if (!paymentData) return null;

    return (
        <main className="relative min-h-screen bg-[#09090b] text-[#fafafa] overflow-x-hidden">
            <ScrollToTop />
            <HeaderSection navLinks={navLinks} />

            <div className="max-w-2xl mx-auto pt-32 pb-20 px-5">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <span className="text-xs uppercase tracking-[0.3em] text-[#d4b96a] font-medium">
                        Paiement sécurisé
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-[#fafafa] mt-6 mb-8 uppercase tracking-tight">
                        Finalisez
                        <br />
                        <span className="italic">votre commande</span>
                    </h2>
                    <p className="text-[#a1a1aa] max-w-lg mx-auto text-base leading-relaxed">
                        Vérifiez vos informations de naissance avant de procéder au paiement
                        sécurisé et de recevoir votre portrait astral.
                    </p>
                    <OrnamentDivider className="mt-10" />
                </motion.div>

                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-8">
                    <h3 className="font-display text-xl font-light text-[#fafafa] mb-6">
                        Récapitulatif
                    </h3>
                    <div className="space-y-3 text-sm">
                        {[
                            { label: 'Formule', value: plans[paymentData.selected_plan].name },
                            { label: 'Adresse E-mail', value: paymentData.email },
                            { label: 'Nom complet', value: paymentData.full_name },
                            {
                                label: 'Date de naissance',
                                value: paymentData.birth_date
                                    ? new Date(paymentData.birth_date).toLocaleDateString('fr-FR', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                      })
                                    : '—',
                            },
                            {
                                label: 'Heure de naissance',
                                value: paymentData.birth_time_unknown
                                    ? 'Non renseignée'
                                    : paymentData.birth_time || '—',
                            },
                            { label: 'Lieu de naissance', value: paymentData.birth_city },
                        ].map((item) => {
                            return (
                                <div
                                    key={item.label}
                                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 sm:gap-6 py-3 border-b border-white/10 last:border-0"
                                >
                                    <span className="text-zinc-400 text-sm shrink-0">
                                        {item.label}
                                    </span>

                                    <span className="text-[#fafafa] text-sm sm:text-right line-clamp-2 wrap-break-word sm:max-w-62.5">
                                        {item.value || '—'}
                                    </span>
                                </div>
                            );
                        })}
                        <div className="pt-4 mt-4 border-t border-zinc-700">
                            <div className="flex justify-between">
                                <span className="text-[#fafafa] font-medium">Total</span>
                                <span className="font-display text-2xl font-light text-[#d4b96a]">
                                    {totalPrice}€
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-center px-5">
                    <button
                        onClick={onSubmit}
                        disabled={processing}
                        className="group inline-flex items-center gap-3 px-10 py-4 bg-[#d4b96a] text-[#09090b] font-medium text-sm tracking-wide rounded-full hover:bg-[#dec87e] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Traitement...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Payer {totalPrice}€
                            </>
                        )}
                    </button>
                </div>
            </div>

            <Footer />
        </main>
    );
}

