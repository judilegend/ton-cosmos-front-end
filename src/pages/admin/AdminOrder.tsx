import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Filter,
    RotateCcw,
    Search,
    Trash2,
    CheckCircle2,
    RefreshCcw,
    Check,
    XCircle,
    type LucideIcon,
    Loader2,
} from 'lucide-react';
import { UseAuth } from '@/context/AuthContext';
import { MaskingService } from '@/services/utilsService';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDeleteOrder } from '@/components/admin/ConfirmDeleteOrder';
import {
    DELETE_ORDER_ENDPOINT,
    RESET_ORDERS_ENDPOINT,
    useApi,
    WEB_SOCKET_BASE,
} from '@/hooks/UseApi';

const StatusConfig: Record<string, { label: string; bg: string; color: string; icon: LucideIcon }> =
    {
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
    annee_cosmique: {
        label: 'Année Cosmique',
        color: 'text-indigo-750 dark:text-indigo-300',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
    },
    cosmos_integral: {
        label: 'Cosmos Intégral',
        color: 'text-amber-700 dark:text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
    },
};

const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
    }).format(amount / 100); 
};

export default function AdminOrder() {
    const {
        isAuthenticated,
        load_all_orders,
        reload_all_orders,
        all_orders,
        total_orders,
        get_all_orders,
        reload_get_orders,
        deleteOrder,
        updateData,
        updateStatus,
    } = UseAuth();

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if(isAuthenticated) {
            get_all_orders(currentPage, ITEMS_PER_PAGE, debouncedSearch, statusFilter);
        }
    }, [currentPage, debouncedSearch, statusFilter, get_all_orders, isAuthenticated]);

    const totalPages = Math.ceil(total_orders / ITEMS_PER_PAGE);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const [openConfirmDialod, setOpenConfirmDialog] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [order_id, setOrder_id] = useState(0);
    const { request: confirmDelete } = useApi<null>();

    const onConfirmDelete = async (value: boolean) => {
        if (value && order_id !== 0) {
            setLoadingDelete(true);
            try {
                const response = await confirmDelete(DELETE_ORDER_ENDPOINT(order_id), {
                    method: 'DELETE',
                });
                if (response) {
                    deleteOrder(order_id);
                }
            } catch (err: unknown) {
                console.log(err);
            } finally {
                setLoadingDelete(false);
                setOpenConfirmDialog(false);
            }
        } else {
            setOpenConfirmDialog(false);
        }
    };

    const { request: resetOrder } = useApi<null>();

    const [loadingReset, setLoadingReset] = useState(false);
    const onResetOrder = async (order_id: number) => {
        setOrder_id(order_id);
        if (order_id !== 0) {
            setLoadingReset(true);
            try {
                await resetOrder(RESET_ORDERS_ENDPOINT(order_id), {
                    method: 'POST',
                });
            } catch (err: unknown) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        const socket = new WebSocket(`${WEB_SOCKET_BASE}/order/ws/admin-order-event`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.order) {
                updateData(data.order);
            }
        };

        return () => {
            socket.close();
        };
    }, [updateData]);

    useEffect(() => {
        const socket = new WebSocket(`${WEB_SOCKET_BASE}/stripe/ws/order-status-for-admin`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if ((data.order_id, data.status)) {
                const order_id = parseInt(data.order_id);
                updateStatus(order_id, data.status);

                if (data.status === 'completed' || data.status === 'failed') {
                    setLoadingReset(false);
                }
            }
        };

        return () => {
            socket.close();
        };
    }, [updateStatus]);

    return (
        <section>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end px-0 md:px-6 justify-between gap-6 mb-12">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-light text-zinc-900 dark:text-[#fafafa] tracking-tight">
                        Gestion des commandes
                    </h1>

                    <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                        Consultez et suivez l'état de l'ensemble des commandes passées par vos
                        clients.
                    </p>
                </div>
            </div>

            <div className='className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md rounded-lg overflow-hidden'>
                {/* HEADER CONTENT LIST */}
                <div className="p-5 border-b border-[rgba(28,25,23,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-60 group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#d4b96a] transition-colors duration-300" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Rechercher"
                                className={`w-full pl-10 pr-10 py-2.5 bg-zinc-100/50 dark:bg-white/3 border border-zinc-200 dark:border-white/20 rounded-xl text-sm text-zinc-900 dark:text-[#fafafa] placeholder-zinc-400 dark:placeholder-[#6b6b77] focus:outline-none focus:ring-4 focus:ring-[#d4b96a]/10 focus:border-[#d4b96a]/40 dark:focus:border-[#d4b96a]/50 dark:focus:ring-[#d4b96a]/5 transition-all duration-300`}
                            />

                            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 pointer-events-none">
                                <span className="text-[10px] font-medium text-zinc-400">⌘</span>
                                <span className="text-[10px] font-medium text-zinc-400">K</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-focus-within:text-[#d4b96a] z-10 transition-colors pointer-events-none" />

                            <Select
                                defaultValue={statusFilter}
                                onValueChange={(value) => handleStatusChange(value)}
                            >
                                <SelectTrigger
                                    className="w-44 pl-10 bg-zinc-100/50 dark:bg-white/3 border-zinc-200 dark:border-white/20 rounded-xl text-sm font-medium text-zinc-900 dark:text-[#fafafa] hover:bg-zinc-200/50 dark:hover:bg-white/6 focus:ring-4 focus:ring-[#d4b96a]/10 focus:border-[#d4b96a]/40 dark:focus:ring-[#d4b96a]/5 dark:focus:border-[#d4b96a]/30 transition-all duration-300"
                                    style={{ height: '44px' }}
                                >
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>

                                <SelectContent className="bg-white dark:bg-[#0c0c0e] border-zinc-200 dark:border-white/10 rounded-xl shadow-xl">
                                    <SelectGroup>
                                        <SelectItem
                                            value="all"
                                            className="focus:bg-[#d4b96a]/10 focus:text-zinc-900 dark:focus:text-[#fafafa] cursor-pointer"
                                        >
                                            Tous les statuts
                                        </SelectItem>
                                        <SelectItem
                                            value="completed"
                                            className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400 cursor-pointer"
                                        >
                                            Livrés
                                        </SelectItem>
                                        <SelectItem
                                            value="processing"
                                            className="focus:bg-blue-500/10 focus:text-blue-600 dark:focus:text-blue-400 cursor-pointer"
                                        >
                                            En cours
                                        </SelectItem>
                                        <SelectItem
                                            value="pending_payment"
                                            className="focus:bg-amber-500/10 focus:text-amber-600 dark:focus:text-amber-400 cursor-pointer"
                                        >
                                            En attente
                                        </SelectItem>
                                        <SelectItem
                                            value="failed"
                                            className="focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                                        >
                                            Erreurs
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50/50 dark:bg-white/2">
                            <tr className="border-b border-zinc-200/60 dark:border-white/6">
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
                                    #
                                </th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
                                    Date
                                </th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
                                    Client
                                </th>
                                <th className="text-center px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
                                    Formule
                                </th>
                                <th className="text-center px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
                                    Montant
                                </th>
                                <th className="text-center px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
                                    Statut
                                </th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {load_all_orders ? (
                                [...Array(7)].map((_, i) => (
                                    <tr
                                        key={`skeleton-${i}`}
                                        className="border-b border-zinc-100 last:border-none dark:border-white/4"
                                    >
                                        <td className="px-6 py-4">
                                            <Skeleton className="h-4 w-8 bg-zinc-100 dark:bg-zinc-800" />
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <Skeleton className="h-4 w-24 mb-1 bg-zinc-100 dark:bg-zinc-800" />
                                            <Skeleton className="h-3 w-12 bg-zinc-50 dark:bg-zinc-800/50" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <Skeleton className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800" />
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-center">
                                            <Skeleton className="h-6 w-20 rounded-full mx-auto bg-zinc-100 dark:bg-zinc-800" />
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-center">
                                            <Skeleton className="h-4 w-16 mx-auto bg-zinc-100 dark:bg-zinc-800" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Skeleton className="h-6 w-24 rounded-full ml-auto bg-zinc-100 dark:bg-zinc-800" />
                                        </td>
                                    </tr>
                                ))
                            ) : total_orders > 0 ? (
                                all_orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-[#1c19170f] hover:bg-[rgba(28,25,23,0.04)] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-[#d4b96a] transition-colors">
                                                {order.id >= 10 ? order.id : `0${order.id}`}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm text-nowrap text-zinc-900 dark:text-zinc-200">
                                                {new Date(order.created_at).toLocaleDateString(
                                                    'fr-FR',
                                                    {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    },
                                                )}
                                            </div>
                                            <div className="text-xs text-nowrap text-zinc-400 dark:text-zinc-400 font-light">
                                                {new Date(order.created_at).toLocaleTimeString(
                                                    'fr-FR',
                                                    {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    },
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-[13px] text-zinc-500 dark:text-zinc-400 truncate max-w-35 font-light">
                                                {MaskingService.maskEmail(order.email)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {(() => {
                                                const planConfig = PlanConfig[
                                                    order.plan_type as keyof typeof PlanConfig
                                                ] || {
                                                    label: order.plan_type,
                                                    color: 'text-zinc-500',
                                                    bg: 'bg-zinc-500/10',
                                                    border: 'border-zinc-500/20',
                                                };
 
                                                return (
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <span
                                                            className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize tracking-[0.15em] ${planConfig.bg} ${planConfig.color} ${planConfig.border}`}
                                                        >
                                                            {planConfig.label}
                                                        </span>
                                                        <div className="flex gap-1 justify-center mt-1">
                                                            {order.has_audio && (
                                                                <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                                    🎧 Audio
                                                                </span>
                                                            )}
                                                            {order.has_poster && (
                                                                <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                                    🖼️ Poster
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                                                {formatCurrency(order.amount_total)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {(() => {
                                                const config =
                                                    StatusConfig[order.status] ||
                                                    StatusConfig.pending_payment;
                                                const Icon = config.icon;
                                                const isLoad = config.label === 'En cours';

                                                return (
                                                    <span
                                                        className={`
                                                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full capitalize 
                                                        text-[10px] font-bold tracking-widest border border-current/10
                                                        ${config.bg} ${config.color}
                                                    `}
                                                    >
                                                        <Icon
                                                            className={`w-3.5 h-3.5 ${isLoad ? 'animate-spin' : ''}`}
                                                            strokeWidth={2.5}
                                                        />
                                                        {config.label}
                                                    </span>
                                                );
                                            })()}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {order.stripe_session_id &&
                                                    order.status === 'failed' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-lg"
                                                            disabled={
                                                                loadingReset &&
                                                                order.id === order_id
                                                            }
                                                            className={`text-amber-500/70 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-all ${loadingReset && order.id === order_id ? 'animate-spin' : ''}`}
                                                            onClick={() => onResetOrder(order.id)}
                                                        >
                                                            <RotateCcw size={25} />
                                                        </Button>
                                                    )}

                                                <Button
                                                    variant="ghost"
                                                    size="icon-lg"
                                                    onClick={() => {
                                                        setOrder_id(order.id);
                                                        setOpenConfirmDialog(true);
                                                    }}
                                                    className="text-red-400/70 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={25} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white dark:bg-zinc-900/50">
                                    <td colSpan={7} className="px-6 py-20">
                                        <div className="flex flex-col items-center justify-center max-w-100 mx-auto text-center">
                                            {/* Icône décorative avec effet de halo */}
                                            <div className="relative mb-6">
                                                <div className="absolute inset-0 bg-[#d4b96a]/10 blur-2xl rounded-full" />
                                                <div className="relative flex items-center justify-center w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                    <Search
                                                        className="w-8 h-8 text-zinc-400"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                            </div>

                                            {/* Texte informatif */}
                                            <h3 className="text-lg font-medium text-zinc-900 dark:text-[#fafafa] mb-2">
                                                Aucun résultat trouvé
                                            </h3>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                                                Nous n'avons trouvé aucune commande correspondant à
                                                vos critères de recherche ou vos filtres actuels.
                                            </p>

                                            {/* Actions de récupération */}
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        if (all_orders.length === 0) {
                                                            reload_get_orders(
                                                                'all',
                                                                1,
                                                                10,
                                                                '',
                                                                'all',
                                                            );
                                                        } else {
                                                            setSearchTerm('');
                                                            setStatusFilter('all');
                                                        }
                                                    }}
                                                    className="gap-2 rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                >
                                                    {reload_all_orders ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                                            Réinitialissation...
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

                {/* Pagination */}
                {total_orders > ITEMS_PER_PAGE && (
                    <div className="p-5 border-t border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {total_orders > 9 ? total_orders : `0${total_orders}`} commande
                            {total_orders > 1 ? 's' : ''}
                        </span>

                        <div className="flex items-center gap-2">
                            {totalPages > 1 && (
                                <>
                                    <Button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        size="icon"
                                        variant="ghost"
                                        className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleNextPage}
                                        disabled={totalPages === 0 || currentPage === totalPages}
                                        className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <ConfirmDeleteOrder
                    isOpen={openConfirmDialod}
                    loading={loadingDelete}
                    onConfirm={onConfirmDelete}
                />
            </div>
        </section>
    );
}
