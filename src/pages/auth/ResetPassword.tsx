import { CosmosLogo } from '@/components/icons';
import { RESET_PASSWORD_ENDPOINT, useApi, VERIFY_RESET_TOKEN_ENDPOINT } from '@/hooks/UseApi';
import { FORGOT_PASSWORD_PATH, LOGIN_PATH } from '@/routes';
import { AlertCircle, Clock, ShieldAlert, Loader2, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ResetPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [loadRendu, setLoadPage] = useState(true);
    const [tokenError, setTokenError] = useState<{
        type: 'missing' | 'expired' | 'invalid' | '';
        value: boolean;
    }>({ type: '', value: false });

    const { request: verify_token } = useApi<null>();

    useEffect(() => {
        const verifyToken = async () => {
            setLoadPage(true);
            try {
                if (!token) {
                    setTokenError({ value: true, type: 'missing' });
                    return;
                }

                const response = await verify_token(
                    `${VERIFY_RESET_TOKEN_ENDPOINT}?token=${token}`,
                    {
                        method: 'GET',
                    },
                );
                if (response && response.status_code === 404) {
                    setTokenError({ value: true, type: 'invalid' });
                } else if (response && response.status_code === 400) {
                    setTokenError({ value: true, type: 'expired' });
                } else {
                    setTokenError({ value: false, type: '' });
                }
            } catch (err: unknown) {
                console.error(err);
                setTokenError({ value: true, type: 'invalid' });
            } finally {
                setLoadPage(false);
            }
        };

        verifyToken();
    }, [token, verify_token]);

    const [isUpdated, setUpdated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState({ value: '', error: false, error_message: '' });
    const [confirmPassword, setConfirmPassword] = useState({
        value: '',
        error: false,
        error_message: '',
    });

    const { request: reset_password } = useApi<null>();

    const handleReset = async () => {
        if (password.value !== confirmPassword.value) {
            setConfirmPassword({
                ...confirmPassword,
                error: true,
                error_message: 'Les mots de passe ne correspondent pas.',
            });
            return;
        }

        setLoading(true);
        try {
            const payload = { token, new_password: password.value };
            const response = await reset_password(RESET_PASSWORD_ENDPOINT, {
                method: 'PUT',
                body: payload,
            });

            if (response?.success) {
                setUpdated(true);
                setPassword({ ...password, value: '' });
                setConfirmPassword({ ...password, value: '' });
            }
        } catch (err: unknown) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loadRendu) {
        return (
            <section className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center px-6 transition-colors">
                <Loader2 className="w-10 h-10 animate-spin text-[#d4b96a]" />
            </section>
        );
    }

    if (tokenError.value) {
        const errorContent = {
            missing: {
                icon: <AlertCircle className="w-8 h-8 text-red-500/80" />,
                bg: 'bg-red-500/10 border-red-500/20',
                title: 'Accès non autorisé',
                desc: "Aucun jeton de sécurité n'a été détecté. Pour réinitialiser votre mot de passe, veuillez utiliser le lien envoyé par e-mail.",
                link: LOGIN_PATH,
                linkText: '← Retour à la connexion',
            },
            invalid: {
                icon: <ShieldAlert className="w-8 h-8 text-orange-500/80" />,
                bg: 'bg-orange-500/10 border-orange-500/20',
                title: 'Lien invalide',
                desc: "Ce lien de récupération semble corrompu ou a déjà été utilisé. Veuillez vérifier l'exactitude de l'URL.",
                link: FORGOT_PASSWORD_PATH,
                linkText: 'Demander un nouveau lien',
            },
            expired: {
                icon: <Clock className="w-8 h-8 text-zinc-500/80 dark:text-zinc-400" />,
                bg: 'bg-zinc-500/10 border-zinc-500/20',
                title: 'Lien expiré',
                desc: "Pour votre sécurité, les liens de réinitialisation ont une durée de validité limitée. Celui-ci n'est plus actif.",
                link: FORGOT_PASSWORD_PATH,
                linkText: 'Réessayer la procédure',
            },
        }[tokenError.type || 'invalid'];

        return (
            <section className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center px-6 transition-colors">
                <div className="w-full max-w-sm text-center">
                    <div
                        className={`w-16 h-16 ${errorContent.bg} border rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                        {errorContent.icon}
                    </div>
                    <h2 className="text-2xl font-light text-zinc-900 dark:text-[#fafafa] mb-3">
                        {errorContent.title}
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-[#a1a1aa] leading-relaxed mb-8">
                        {errorContent.desc}
                    </p>
                    <Link
                        to={errorContent.link}
                        className={
                            tokenError.type === 'missing'
                                ? 'text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-[#52525b] dark:hover:text-[#fafafa] transition-all'
                                : 'inline-block px-8 py-3 bg-[#d4b96a] text-white dark:text-[#09090b] font-medium text-sm rounded-xl hover:brightness-110 transition-all shadow-md dark:shadow-none cursor-pointer'
                        }
                    >
                        {errorContent.linkText}
                    </Link>
                </div>
            </section>
        );
    }

    if (isUpdated) {
        return (
            <section className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center px-6 transition-colors">
                <div className="w-full max-w-sm text-center">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>

                    <h2 className="text-2xl font-light text-zinc-900 dark:text-[#fafafa] mb-3">
                        Mot de passe réinitialisé
                    </h2>

                    <p className="text-sm text-zinc-600 dark:text-[#a1a1aa] leading-relaxed mb-8">
                        Votre nouveau mot de passe a été enregistré avec succès. Vous pouvez
                        maintenant accéder à votre espace administrateur.
                    </p>

                    <Link
                        to={LOGIN_PATH}
                        className="inline-block px-8 py-3 bg-[#d4b96a] text-white dark:text-[#09090b] font-medium text-sm rounded-xl hover:brightness-110 transition-all shadow-md dark:shadow-none cursor-pointer"
                    >
                        Retour à la connexion
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
                        handleReset();
                    }}
                    className="rounded-2xl border border-zinc-200 bg-white dark:border-white/6 dark:bg-white/1.5 p-8 shadow-sm dark:shadow-none"
                >
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        Nouveau mot de passe
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                        Choisissez un mot de passe robuste pour garantir la sécurité de votre accès.
                    </p>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-[#a1a1aa] mb-2">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            value={password.value}
                            onChange={(e) =>
                                setPassword({ ...password, value: e.target.value, error: false })
                            }
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-zinc-100 dark:bg-white/3 border border-zinc-200 dark:border-white/20 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 transition-all"
                            required
                        />
                        {password.error && (
                            <p className="text-red-500 dark:text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" /> {password.error_message}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-[#a1a1aa] mb-2">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            value={confirmPassword.value}
                            onChange={(e) =>
                                setConfirmPassword({
                                    ...confirmPassword,
                                    value: e.target.value,
                                    error: false,
                                })
                            }
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-zinc-100 dark:bg-white/3 border border-zinc-200 dark:border-white/20 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 transition-all"
                            required
                        />
                        {confirmPassword.error && (
                            <p className="text-red-500 dark:text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" /> {confirmPassword.error_message}
                            </p>
                        )}
                    </div>

                    <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-white/2 border border-zinc-200 dark:border-white/5">
                        <p className="text-xs font-semibold text-zinc-700 dark:text-[#a1a1aa] mb-2">
                            Sécurité requise :
                        </p>
                        <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1.5 list-disc list-inside">
                            <li>Au moins 8 caractères</li>
                            <li>Un chiffre</li>
                            <li>Un caractère spécial</li>
                        </ul>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-[#d4b96a] text-white dark:text-[#09090b] font-bold text-sm rounded-xl hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mise à jour...
                            </>
                        ) : (
                            'Réinitialiser le mot de passe'
                        )}
                    </button>
                </form>

                <Link
                    to={LOGIN_PATH}
                    className="mt-8 text-sm text-zinc-500 dark:text-[#52525b] hover:text-zinc-900 dark:hover:text-[#a1a1aa] transition-colors block text-center font-medium cursor-pointer"
                >
                    ← Retour à la page de connexion
                </Link>
            </div>
        </section>
    );
}
