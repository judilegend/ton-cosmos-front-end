import AlertMessage from '@/components/AlertMessage';
import { UseAuth, type AdminData } from '@/context/AuthContext';
import { UPDATE_ADMIN_DATA, UPDATE_PASSWORD_ENDPOINT, useApi } from '@/hooks/UseApi';
import { UseTheme } from '@/theme/ThemeProvider';
import { AlertCircle, Laptop, Loader2, Moon, Sun } from 'lucide-react';
import React, { useState } from 'react';

export default function Settings() {
    const { admin, updateAdmin } = UseAuth();

    const [myAlert, setAlert] = useState<{
        isProfile: boolean;
        value: boolean;
        title: string;
        message: string;
        variant: 'default' | 'destructive';
    }>({ isProfile: false, value: false, title: '', message: '', variant: 'destructive' });

    const [email, setEmail] = useState({
        value: admin?.email || '',
        error: false,
        error_message: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const { theme, setTheme } = UseTheme();

    const { request: update_admin_data } = useApi<AdminData>();
    const [loadUpdateData, setLoadUpdateData] = useState(false);
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadUpdateData(true);
        try {
            const response = await update_admin_data(UPDATE_ADMIN_DATA, {
                method: 'PUT',
                body: { email: email.value },
            });
            if (response?.success) {
                updateAdmin(response.data);
                setAlert({
                    isProfile: true,
                    value: true,
                    title: 'Profil mis à jour',
                    message: 'Votre profil a été mis à jour avec succès.',
                    variant: 'default',
                });
            } else {
                updateAdmin(admin);
                setAlert({
                    isProfile: true,
                    value: true,
                    title: 'Erreur de mise à jour',
                    message: 'Une erreur est survenue lors de la mise à jour de votre profil.',
                    variant: 'destructive',
                });
            }
        } catch (err) {
            console.log(err);
            setAlert({
                isProfile: true,
                value: true,
                title: 'Erreur de mise à jour',
                message:
                    'Une erreur est survenue lors de la mise à jour de votre profil. Veuillez réessayer.',
                variant: 'destructive',
            });
        } finally {
            setLoadUpdateData(false);
        }
    };

    const { request: update_admin_password } = useApi<AdminData>();
    const [loadUpdatePassword, setLoadUpdatePassword] = useState(false);
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setAlert({
                isProfile: false,
                value: true,
                title: 'Erreur de mot de passe',
                message: 'Les mots de passe ne correspondent pas. Veuillez réessayer.',
                variant: 'destructive',
            });
            return;
        }
        setLoadUpdatePassword(true);

        const payload = {
            old_password: passwordData.currentPassword,
            new_password: passwordData.newPassword,
        };

        try {
            const response = await update_admin_password(UPDATE_PASSWORD_ENDPOINT, {
                method: 'PATCH',
                body: payload,
            });
            if (response?.success) {
                setAlert({
                    isProfile: false,
                    value: true,
                    title: 'Mot de passe mis à jour',
                    message: 'Votre mot de passe a été mis à jour avec succès.',
                    variant: 'default',
                });
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword : "" })
            } else {
                setAlert({
                    isProfile: false,
                    value: true,
                    title: 'Erreur de mise à jour',
                    message:
                        response?.message ||
                        'Une erreur est survenue lors de la mise à jour de votre mot de passe.',
                    variant: 'destructive',
                });
            }
        } catch (err) {
            console.log(err);
            setAlert({
                isProfile: false,
                value: true,
                title: 'Erreur de mise à jour',
                message:
                    'Une erreur est survenue lors de la mise à jour de votre mot de passe. Veuillez réessayer.',
                variant: 'destructive',
            });
        } finally {
            setLoadUpdatePassword(false);
        }
    };

    return (
        <section className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-zinc-800 dark:text-zinc-100">
            <div>
                <h1 className="font-display text-3xl sm:text-4xl font-light text-zinc-900 dark:text-[#fafafa] tracking-tight">
                    Configuration
                </h1>
                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                    Gérez vos paramètres de compte, votre sécurité et l'apparence de votre
                    dashboard.
                </p>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
                {/* SECTION PROFIL */}
                <div className="md:col-span-1">
                    <h2 className="text-lg font-medium">Informations du profil</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Mettez à jour vos identifiants d'accès professionnels.
                    </p>
                </div>
                <div className="md:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                    {myAlert.value && myAlert.isProfile && (
                        <AlertMessage
                            title={myAlert.title}
                            description={myAlert.message}
                            variant={myAlert.variant}
                            className={`mb-8 ${myAlert.variant === 'default' && 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400'}`}
                        />
                    )}

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" htmlFor="email">
                                Adresse Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email.value}
                                placeholder="admin@exemple.com"
                                className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/20 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 focus:border-[#d4b96a] transition-all"
                                onChange={(e) => {
                                    setEmail({ ...email, value: e.target.value });
                                }}
                                required
                            />
                            {email.error && (
                                <p className="text-red-500 dark:text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                    <AlertCircle className="w-3 h-3" />
                                    {email.error_message}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-3 bg-[#d4b96a] text-white dark:text-[#09090b] font-medium text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loadUpdateData ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                        Enregistrement...
                                    </>
                                ) : (
                                    'Enregistrer'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* SECTION MOT DE PASSE */}
                <div className="md:col-span-1">
                    <h2 className="text-lg font-medium">Sécurité & Mot de passe</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Modifiez votre mot de passe pour sécuriser votre accès administrateur.
                    </p>
                </div>
                <div className="md:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                    {myAlert.value && !myAlert.isProfile && (
                        <AlertMessage
                            title={myAlert.title}
                            description={myAlert.message}
                            variant={myAlert.variant}
                            className={`mb-8 ${myAlert.variant === 'default' && 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400'}`}
                        />
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label
                                className="block text-sm font-medium mb-1.5"
                                htmlFor="current-password"
                            >
                                Mot de passe actuel
                            </label>
                            <input
                                id="current-password"
                                type="password"
                                placeholder="*************"
                                className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/20 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 focus:border-[#d4b96a] transition-all"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium mb-1.5"
                                    htmlFor="new-password"
                                >
                                    Nouveau mot de passe
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    placeholder="*************"
                                    className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/20 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 focus:border-[#d4b96a] transition-all"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-1.5"
                                    htmlFor="confirm-password"
                                >
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="*************"
                                    className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/20 rounded-xl text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#52525b] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b96a]/20 focus:border-[#d4b96a] transition-all"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-3 bg-[#d4b96a] text-white dark:text-[#09090b] font-medium text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loadUpdatePassword ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mise à
                                        jour en cours...
                                    </>
                                ) : (
                                    'Mettre à jour le mot de passe'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* SECTION THÈME */}
                <div className="md:col-span-1">
                    <h2 className="text-lg font-medium">Thème de l'application</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Personnalisez l'affichage de votre tableau de bord.
                    </p>
                </div>
                <div className="md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Card Light */}
                        <button
                            type="button"
                            onClick={() => setTheme('light')}
                            className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all h-28 text-zinc-300 bg-white dark:bg-zinc-300 border-zinc-300 hover:border-[#d1b357] shadow-sm ${theme === 'light' ? 'border-[#d1b357]' : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-sm'}`}
                        >
                            <Sun className="text-2xl text-orange-500" />
                            <div>
                                <p className="font-semibold text-sm text-zinc-800">Clair</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-600">
                                    Interface lumineuse classique
                                </p>
                            </div>
                        </button>

                        {/* Card Dark */}
                        <button
                            type="button"
                            onClick={() => setTheme('dark')}
                            className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all h-28 text-zinc-300 bg-zinc-900 hover:border-[#d1b357] shadow-sm ${theme === 'dark' ? 'border-[#d1b357]' : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-sm'}`}
                        >
                            <Moon className="text-2xl" />
                            <div>
                                <p className="font-semibold text-sm text-zinc-300">Sombre</p>
                                <p className="text-xs text-zinc-400">
                                    Idéal pour les environnements sombres
                                </p>
                            </div>
                        </button>

                        {/* Card System */}
                        <button
                            type="button"
                            onClick={() => setTheme('system')}
                            className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all h-28 text-zinc-300 bg-zinc-900 hover:border-[#d1b357] shadow-sm ${theme === 'system' ? 'border-[#d1b357]' : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-sm'}`}
                        >
                            <Laptop className="text-2xl" />
                            <div>
                                <p className="font-semibold text-sm text-zinc-300">Système</p>
                                <p className="text-xs text-zinc-400">S'adapte aux réglages du PC</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* METADATA DE SÉCURITÉ */}
                <div className="md:col-span-1">
                    <h2 className="text-lg font-medium">Dernières connexions</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Historique de sécurité récolté automatiquement par votre modèle.
                    </p>
                </div>
                <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 gap-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Dernier appareil
                            </span>
                            <p className="font-medium text-sm text-zinc-600 dark:text-zinc-300">
                                {admin?.last_device_logged || 'Aucune donnée'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Dernière adresse IP
                            </span>
                            <p className="font-mono font-medium text-sm text-zinc-600 dark:text-zinc-300">
                                {admin?.last_ip_logged || 'Aucune donnée'}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-right">
                        Dernière mise à jour du compte : {admin?.updated_at}
                    </div>
                </div>
            </div>
        </section>
    );
}
