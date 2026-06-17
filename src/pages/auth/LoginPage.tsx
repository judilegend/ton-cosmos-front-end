import { CosmosLogo } from '@/components/icons';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ADMIN_DASHBOARD_PATH, FORGOT_PASSWORD_PATH } from '@/routes';
import { LOGIN_ENDPOINT, useApi } from '@/hooks/UseApi';
import { UseAuth } from '@/context/AuthContext';
import AlertMessage from '@/components/AlertMessage';

interface LoginDataResponse {
    error?: 'email' | 'password';
    access_token: string;
    token_type: string; // bearer
}

export default function LoginPage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState({ value: '', error: false, error_message: '' });
    const [password, setPassword] = useState({ value: '', error: false, error_message: '' });
    const [remember_me, setRememberMe] = useState(false);
    const [error, serError] = useState<{
        value: boolean;
        title: string;
        message: string;
        variant: 'default' | 'destructive';
    }>({ value: false, title: '', message: '', variant: 'destructive' });

    const { login } = UseAuth();
    const { request } = useApi<LoginDataResponse>();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const payload = {
                email: email.value,
                password: password.value,
                remember_me,
            };
            const response = await request(LOGIN_ENDPOINT, { body: payload, method: 'POST' });
            if (response?.success) {
                const access_token = response.data.access_token;
                login(access_token);
                navigate(ADMIN_DASHBOARD_PATH, { replace: true });
            } else if (response?.data?.error) {
                handleBackendError(response.data.error, response.message);
            }
        } catch {
            serError({
                value: true,
                title: 'Erreur HTTP',
                message: 'Impossible d’envoyer la requête. Veuillez réessayer plus tard.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackendError = (
        errorType: 'email' | 'password' | 'locked',
        serverMessage: string,
    ) => {
        if (errorType === 'email') {
            setEmail((prev) => ({ ...prev, error: true, error_message: 'Email invalide' }));
        } else if (errorType === 'password') {
            setPassword((prev) => ({
                ...prev,
                error: true,
                error_message: 'Mot de passe incorrect',
            }));
        } else if (errorType === 'locked') {
            serError({
                value: true,
                title: 'Compte Verrouillé',
                message: serverMessage || 'Trop de tentatives. Compte bloqué temporairement.',
                variant: 'destructive',
            });
        }
    };

    return (
        <section className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center px-6 transition-colors duration-300">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-10">
                    <CosmosLogo className="w-12 h-12 text-[#d4b96a] mx-auto mb-5" />
                    <h1 className="font-display text-2xl font-light text-zinc-900 dark:text-[#fafafa]">
                        Administration
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-[#52525b] mt-2 tracking-wide uppercase text-[10px] font-bold">
                        Accès réservé
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:shadow-none dark:border-white/6 dark:bg-white/2 p-8"
                >
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        Authentification
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                        Saisissez vos identifiants pour accéder à votre espace d'administration.
                    </p>

                    {error.value && (
                        <AlertMessage
                            title={error.title}
                            description={error.message}
                            variant={error.variant}
                            className="mb-8"
                        />
                    )}

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-[#a1a1aa] mb-2">
                            Adresse E-mail
                        </label>
                        <input
                            type="email"
                            value={email.value}
                            onChange={(e) => {
                                setEmail({ ...email, value: e.target.value, error: false });
                            }}
                            placeholder="nom@exemple.com"
                            className="w-full px-4 py-3 bg-zinc-100 dark:bg-white/3 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 focus:border-[#d4b96a] transition-all"
                            required
                        />
                        {email.error && (
                            <p className="text-red-500 dark:text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" />
                                {email.error_message}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-[#a1a1aa]">
                                Mot de passe
                            </label>
                            <Link
                                to={FORGOT_PASSWORD_PATH}
                                className="text-xs font-semibold text-[#b59a4d] dark:text-[#d4b96a] hover:underline"
                            >
                                Oublié ?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password.value}
                            onChange={(e) => {
                                setPassword({ ...password, value: e.target.value, error: false });
                            }}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-zinc-100 dark:bg-white/3 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 focus:border-[#d4b96a] transition-all"
                            required
                        />
                        {password.error && (
                            <p className="text-red-500 dark:text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" />
                                {password.error_message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 mb-6">
                        <Checkbox
                            id="remember-me"
                            checked={remember_me}
                            onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                            className="border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-[#d4b96a] data-[state=checked]:border-[#d4b96a]"
                        />
                        <Label
                            htmlFor="remember-me"
                            className="text-sm text-zinc-600 dark:text-[#a1a1aa] cursor-pointer"
                        >
                            Rester connecté
                        </Label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-[#d4b96a] text-white dark:text-[#09090b] font-bold text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <Link
                    to="/landing"
                    className="mt-8 text-sm text-zinc-500 dark:text-[#52525b] hover:text-zinc-800 dark:hover:text-[#a1a1aa] transition-colors block text-center font-medium"
                >
                    ← Retour au site
                </Link>
            </div>
        </section>
    );
}
