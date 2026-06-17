import { CosmosLogo } from '@/components/icons';
import { FORGOT_PASSWORD_ENDPOINT, useApi } from '@/hooks/UseApi';
import { LOGIN_PATH } from '@/routes';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPage() {
    const [requestNumber, setRequestNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [email, setEmail] = useState({ value: '', error: false, error_message: '' });

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const { request } = useApi<null>();
    const handleSend = async () => {
        if (!email.value) {
            setEmail({
                ...email,
                error: true,
                error_message: 'Veuillez entrer une adresse e-mail.',
            });
            return;
        }

        setLoading(true);
        try {
            const payload = { email: email.value };
            const response = await request(FORGOT_PASSWORD_ENDPOINT, {
                method: 'POST',
                body: payload,
            });

            if (response?.success) {
                setIsSubmitted(true);
            }
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        const delays = [60, 90, 180, 300];
        setIsResending(true);
        setLoading(true);

        try {
            const payload = { email: email.value };
            const response = await request(FORGOT_PASSWORD_ENDPOINT, {
                method: 'POST',
                body: payload,
            });

            if (response?.success) {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error('Erreur renvoi email:', error);
        } finally {
            setLoading(false);
            setIsResending(false);

            const currentDelay =
                requestNumber < delays.length ? delays[requestNumber] : delays[delays.length - 1];

            setCountdown(currentDelay);

            setRequestNumber((prev) => prev + 1);
        }
    };

    if (isSubmitted) {
        return (
            <section className="min-h-screen bg-zinc-50 dark:bg-transparent flex items-center justify-center px-6 transition-colors">
                <div className="w-full max-w-sm text-center">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-[#d4b96a]/10 border border-[#d4b96a]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CosmosLogo className="w-8 h-8 text-[#d4b96a]" />
                        </div>
                        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-[#fafafa] mb-3">
                            Vérifiez vos e-mails
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-[#a1a1aa] leading-relaxed">
                            Si un compte existe pour{' '}
                            <span className="font-medium text-zinc-900 dark:text-[#fafafa]">
                                {email.value}
                            </span>
                            , vous recevrez un lien de réinitialisation d'ici quelques instants.
                        </p>
                    </div>

                    <div className="mb-8 pt-6 border-t border-zinc-200 dark:border-white/5">
                        <p className="text-xs text-zinc-500 dark:text-[#52525b] mb-3">
                            Vous n'avez rien reçu ?
                        </p>

                        {requestNumber >= 4 ? (
                            <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-lg p-4 text-left">
                                <p className="text-xs text-red-600 dark:text-red-400/90 leading-relaxed">
                                    <strong>Limite d'essais atteinte.</strong>
                                    <br />
                                    Pour des raisons de sécurité, veuillez vérifier vos spams ou
                                    contacter le support.
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={isResending || countdown > 0}
                                className="text-sm font-medium text-zinc-900 dark:text-[#fafafa] hover:text-[#d4b96a] dark:hover:text-[#d4b96a] disabled:text-zinc-400 dark:disabled:text-[#52525b] disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                {isResending
                                    ? 'Envoi en cours...'
                                    : countdown > 0
                                      ? `Renvoyer l'e-mail (${countdown}s)`
                                      : 'Renvoyer le lien de récupération'}
                            </button>
                        )}
                    </div>

                    <Link
                        to={LOGIN_PATH}
                        className="text-sm font-medium text-zinc-500 dark:text-[#52525b] hover:text-zinc-800 dark:hover:text-[#fafafa] transition-all cursor-pointer"
                    >
                        ← Retour à la connexion
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center px-6 transition-colors">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <CosmosLogo className="w-12 h-12 text-[#d4b96a] mx-auto mb-5" />
                    <h1 className="font-display text-2xl font-light text-zinc-900 dark:text-[#fafafa]">
                        Administration
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-[#52525b] mt-2 tracking-wide uppercase text-[10px] font-bold">
                        Accès réservé
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:shadow-none dark:border-white/6 dark:bg-white/2 p-8"
                >
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        Mot de passe oublié ?
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                        Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                    </p>

                    <label className="block text-sm font-medium text-zinc-700 dark:text-[#a1a1aa] mb-2.5">
                        Adresse E-mail
                    </label>
                    <input
                        type="email"
                        value={email.value}
                        onChange={(e) => {
                            setEmail({ ...email, value: e.target.value, error: false });
                        }}
                        placeholder="admin@cosmos.com"
                        className="w-full px-4 py-3.5 bg-zinc-100 dark:bg-white/3 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 dark:focus:border-[#d4b96a]/25 transition-all"
                        required
                    />
                    {email.error && (
                        <p className="text-red-500 dark:text-red-400/80 text-xs mt-2.5 flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3" />
                            {email.error_message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-5 py-3.5 bg-[#d4b96a] text-white dark:text-[#09090b] font-semibold text-sm rounded-xl hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Traitement...
                            </>
                        ) : (
                            'Envoyer le lien'
                        )}
                    </button>
                </form>

                <Link
                    to={LOGIN_PATH}
                    className="mt-8 text-sm text-zinc-500 dark:text-[#52525b] hover:text-zinc-800 dark:hover:text-[#a1a1aa] transition-colors block text-center font-medium cursor-pointer"
                >
                    Retourner à la page de connexion
                </Link>
            </div>
        </section>
    );
}
