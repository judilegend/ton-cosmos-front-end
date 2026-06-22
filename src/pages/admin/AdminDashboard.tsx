import {
    BarChart3,
    Check,
    CheckCircle2,
    Clock,
    Euro,
    ExternalLink,
    Loader2,
    RefreshCcw,
    RotateCcw,
    Search,
    TrendingUp,
    Users,
    XCircle,
    type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_ORDER_PATH } from '@/routes';
import { UseAuth } from '@/context/AuthContext';
import { MaskingService } from '@/services/utilsService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { WEB_SOCKET_BASE } from '@/hooks/UseApi';

const StatusConfig: Record<string, { label: string; bg: string; color: string; icon: LucideIcon }> = {
    pending_payment: {
        label: 'Attente paiement',
        bg: 'bg-zinc-500/10',
        color: 'text-zinc-600 dark:text-zinc-400',
        icon: Clock,
    },
    paid: {
        label: 'Payé',
        bg: 'bg-emerald-500/10',
        color: 'text-emerald-600 dark:text-emerald-400',
        icon: CheckCircle2,
    },
    processing: {
        label: 'En cours',
        bg: 'bg-blue-500/10',
        color: 'text-blue-600 dark:text-blue-400',
        icon: RefreshCcw,
    },
    completed: {
        label: 'Terminé',
        bg: 'bg-[#d4b96a]/10',
        color: 'text-[#a88b3c] dark:text-[#a88b3c]',
        icon: Check,
    },
    failed: {
        label: 'Échec',
        bg: 'bg-rose-500/10',
        color: 'text-rose-600 dark:text-rose-400',
        icon: XCircle,
    },
};

const PlanConfig = {
    essentiel: {
        label: 'Essentiel',
        color: 'text-emerald-700 dark:text-emerald-300',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
    },
    complet: {
        label: 'Complet',
        color: 'text-[#a88b3c] dark:text-[#d4b96a]',
        bg: 'bg-[#d4b96a]/10',
        border: 'border-[#d4b96a]/20',
    },
};

const Icons = {
    Euro: Euro,
    TrendingUp: TrendingUp,
    Users: Users,
    BarChart3: BarChart3,
};

export default function AdminDashboard() {
    const {
        reload_get_orders,
        orders_dashboard,
        load_order_dashboard,
        stats,
        loadStat,
        reload_order_dashboard,
        updateData,
        updateStatus,
    } = UseAuth();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount / 100);
    };

    // WebSocket : Événements des commandes
    useEffect(() => {
        const socket = new WebSocket(`${WEB_SOCKET_BASE}/order/ws/admin-order-event`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.order) {
                updateData(data.order);
            }
        };

        socket.onopen = () => console.log('Connecté au WebSocket for order');
        socket.onclose = () => console.log('WebSocket order fermé');

        return () => {
            socket.close();
        };
    }, []); // Correction: tableau vide pour éviter la boucle infinie

    // WebSocket : Statuts des paiements Stripe
    useEffect(() => {
        const socket_status = new WebSocket(`${WEB_SOCKET_BASE}/stripe/order/ws/order-status-for-admin`);

        socket_status.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.order_id && data.status) {
                const order_id = parseInt(data.order_id);
                updateStatus(order_id, data.status);
            }
        };

        socket_status.onopen = () => console.log('Connecté au WebSocket for status');
        socket_status.onclose = () => console.log('WebSocket status fermé');

        return () => {
            socket_status.close();
        };
    }, []); // Correction: tableau vide pour éviter la boucle infinie

    return (
        <section>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end px-0 md:px-6 justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4b96a] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4b96a]"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-500">
                            Session Active
                        </span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-4xl font-light text-zinc-900 dark:text-[#fafafa] tracking-tight">
                        Dashboard
                    </h1>

                    <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                        Ravi de vous revoir,{' '}
                        <span className="font-medium text-zinc-900 dark:text-zinc-200">Joseph</span>.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className="group relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-300 shadow-sm dark:shadow-none overflow-hidden"
                    >
                        <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <ExternalLink size={16} className="text-[#d4b96a] opacity-80" />
                        <span>Voir le site</span>
                    </Link>
                </div>
            </div>

            {/* Skeletons des stats */}
            {loadStat && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md p-5"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <Skeleton className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800" />
                                <Skeleton className="h-4 w-4 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                            </div>
                            <Skeleton className="h-8 w-16 mb-2 bg-zinc-200 dark:bg-zinc-800" />
                            <Skeleton className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                    ))}
                </div>
            )}

            {/* Stats cards */}
            {stats.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((stat) => {
                        const Icon = Icons[stat.icon as keyof typeof Icons] || BarChart3;
                        return (
                            <div
                                key={stat.label}
                                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:scale-103 shadow-md p-5 transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-xs text-[#a8a29e]">{stat.label}</span>
                                    <Icon className="w-4 h-4 text-[#a8a29e]" />
                                </div>
                                <div className="font-display text-2xl font-light text-[#1c1917] dark:text-neutral-300">
                                    {stat.value}
                                </div>
                                {stat.sub !== '0 erreur(s)' && (
                                    <div
                                        className={`text-xs mt-1 ${stat.alert ? 'text-red-400' : 'text-[#a8a29e]'}`}
                                    >
                                        {stat.sub}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Tableau des commandes (Correction de la syntaxe className ici) */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md overflow-hidden">
                {/* Header Tableau */}
                <div className="flex items-end justify-between gap-x-8 p-5 mb-5">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-[#fafafa] tracking-tight">
                            Commandes récentes
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-[#a1a1aa] leading-relaxed mt-1 font-light">
                            Consultez et gérez les dernières transactions effectuées sur votre boutique en temps réel.
                        </p>
                    </div>

                    <Link
                        to={ADMIN_ORDER_PATH}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/20 rounded-xl shadow-sm dark:shadow-none hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-[#fafafa] hover:border-zinc-300 dark:hover:border-white/15 active:scale-[0.97] transition-all duration-200 cursor-pointer"
                    >
                        <span>Voir tout</span>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50/50 dark:bg-white/2">
                            <tr className="border-b border-zinc-200/60 dark:border-white/6">
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">#</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">Date</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">Client</th>
                                <th className="text-center px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">Formule</th>
                                <th className="text-center px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">Montant</th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">Statut</th>
                            </tr>
                        </thead>

                        <tbody>
                            {load_order_dashboard ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="border-b border-zinc-100 last:border-none dark:border-white/4">
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-8 bg-zinc-100 dark:bg-zinc-800" /></td>
                                        <td className="px-6 py-4">
                                            <Skeleton className="h-4 w-24 mb-1 bg-zinc-100 dark:bg-zinc-800" />
                                            <Skeleton className="h-3 w-12 bg-zinc-50 dark:bg-zinc-800/50" />
                                        </td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800" /></td>
                                        <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-20 rounded-full mx-auto bg-zinc-100 dark:bg-zinc-800" /></td>
                                        <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-16 mx-auto bg-zinc-100 dark:bg-zinc-800" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-24 rounded-full ml-auto bg-zinc-100 dark:bg-zinc-800" /></td>
                                    </tr>
                                ))
                            ) : orders_dashboard.length > 0 ? (
                                orders_dashboard.slice(0, 5).map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-zinc-100 last:border-none dark:border-white/4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-medium text-nowrap text-zinc-500 dark:text-zinc-400 group-hover:text-[#d4b96a] transition-colors">
                                                #{order.id > 9 ? order.id : `0${order.id}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-zinc-900 text-nowrap dark:text-zinc-200">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                            <div className="text-xs text-zinc-400 text-nowrap dark:text-zinc-400 font-light">
                                                {new Date(order.created_at).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[13px] text-zinc-500 text-nowrap dark:text-zinc-400 truncate max-w-35 font-light">
                                                {MaskingService.maskEmail(order.email)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {(() => {
                                                const planConfig = PlanConfig[order.plan_type as keyof typeof PlanConfig] || {
                                                    color: 'text-zinc-500',
                                                    bg: 'bg-zinc-500/10',
                                                    border: 'border-zinc-500/20',
                                                };
                                                return (
                                                    <span className={`inline-block text-[10px] text-nowrap font-bold px-2.5 py-1 rounded-full border capitalize tracking-[0.15em] ${planConfig.bg} ${planConfig.color} ${planConfig.border}`}>
                                                        {order.plan_type}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-semibold text-nowrap text-zinc-900 dark:text-zinc-200">
                                                {formatCurrency(order.amount_total)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {(() => {
                                                const config = StatusConfig[order.status] || StatusConfig.pending_payment;
                                                const Icon = config.icon;
                                                return (
                                                    <span className={`inline-flex items-center text-nowrap gap-1.5 px-2.5 py-1 rounded-full capitalize text-[10px] font-bold tracking-widest border border-current/10 ${config.bg} ${config.color}`}>
                                                        <Icon
                                                            className={`w-3.5 h-3.5 ${config.label === 'En cours' ? 'animate-spin' : ''}`}
                                                            strokeWidth={2.5}
                                                        />
                                                        {config.label}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white dark:bg-zinc-900/50">
                                    <td colSpan={7} className="px-6 py-20">
                                        <div className="flex flex-col items-center justify-center max-w-100 mx-auto text-center">
                                            <div className="relative mb-6">
                                                <div className="absolute inset-0 bg-[#d4b96a]/10 blur-2xl rounded-full" />
                                                <div className="relative flex items-center justify-center w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                    <Search className="w-8 h-8 text-zinc-400" strokeWidth={1.5} />
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-medium text-zinc-900 dark:text-[#fafafa] mb-2">
                                                En attente de vos premières commandes
                                            </h3>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                                                Il n'y a pour le moment aucune transaction à afficher. Dès qu'un client passera commande, les détails s'afficheront sur cette page.
                                            </p>

                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => reload_get_orders('dashboard', 1, 10, '', 'all')}
                                                    className="gap-2 rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                >
                                                    {reload_order_dashboard ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Réinitialisation...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RotateCcw className="w-4 h-4" />
                                                            Réinitialiser
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}