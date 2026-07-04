import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { setToken, clearToken, getAccessToken } from '@/services/tokenService';
import { FIND_ADMIN_DATA, FIND_ORDERS_ENDPOINT, GET_STATS_ENDPOINT, useApi } from '@/hooks/UseApi';

export interface AdminData {
    email: string;
    last_device_logged: string | null;
    last_ip_logged: string | null;
    updated_at: string;
}

type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'completed' | 'failed';
export interface Order {
    id: number;
    email: string;
    full_name: string;
    birth_date: string;
    birth_time: string;
    birth_city: string;
    latitude: number;
    longitude: number;
    stripe_session_id: string;
    plan_type: string;
    status: OrderStatus;
    amount_total: number;
    has_audio?: boolean;
    has_poster?: boolean;
    created_at: string;
    updated_at: string;
}

export interface Stats {
    label: string;
    value: string;
    icon: 'Euro' | 'TrendingUp' | 'Users' | 'BarChart3';
    sub: string;
    alert?: boolean;
}

type AuthContextType = {
    isAuthenticated: boolean;
    loading: boolean;

    admin: AdminData | null;

    orders_dashboard: Order[];
    load_order_dashboard: boolean;
    reload_order_dashboard: boolean;

    all_orders: Order[];
    load_all_orders: boolean;
    reload_all_orders: boolean;
    total_orders: number;
    get_all_orders: (page: number, limit: number, search: string, status: string) => Promise<void>;

    loadStat: boolean;
    stats: Stats[];

    reload_get_orders: (
        type: 'dashboard' | 'all',
        page: number,
        limit: number,
        search: string,
        status: string,
    ) => void;
    deleteOrder: (order_id: number) => void;
    updateData: (order: Order) => void;
    updateStatus: (order_id: number, status: OrderStatus) => void;

    updateAdmin: (admin: AdminData | null) => void;

    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const [admin, setAdmin] = useState<AdminData | null>(null);

    const [orders_dashboard, set_order_dashboard] = useState<Order[]>([]);
    const [load_order_dashboard, set_load_order_dashboard] = useState(true);
    const [reload_order_dashboard, set_reload_order_dashboard] = useState(false);

    const [all_orders, set_all_orders] = useState<Order[]>([]);
    const [load_all_orders, set_load_all_orders] = useState(false);
    const [reload_all_orders, set_reload_all_orders] = useState(false);
    const [total_orders, setTotal_orders] = useState(0);

    const [loadStat, setLoadStat] = useState(true);
    const [stats, setStats] = useState<Stats[]>([]);

    const { request: find_admin } = useApi<AdminData>();

    const get_admin_data = useCallback(async () => {
        try {
            const response = await find_admin(`${FIND_ADMIN_DATA}?skip=0&limit=10`, {
                method: 'GET',
            });
            if (response?.success) {
                setAdmin(response.data);
            } 
        } catch {
            setAdmin(null);
        }
    }, [find_admin]);

    const { request: find_orders } = useApi<{ items: Order[]; total: number }>();

    const get_order_dashboard = useCallback(async () => {
        set_load_order_dashboard(true);
        try {
            const response = await find_orders(`${FIND_ORDERS_ENDPOINT}?skip=0&limit=10`, {
                method: 'GET',
            });
            if (response?.success) {
                set_order_dashboard(response.data.items);
                setTotal_orders(response.data.total);
            }
        } catch {
            set_order_dashboard([]);
            setTotal_orders(0);
        } finally {
            set_load_order_dashboard(false);
        }
    }, [find_orders]);

    const get_all_orders = useCallback(
        async (page: number, limit: number, search: string = '', status: string = 'all') => {
            set_load_all_orders(total_orders === 0);
            const skip = (page - 1) * limit;

            const params = new URLSearchParams({
                skip: skip.toString(),
                limit: limit.toString(),
            });

            if (search) params.append('search', search);
            if (status && status !== 'all') params.append('status', status);

            try {
                const response = await find_orders(`${FIND_ORDERS_ENDPOINT}?${params.toString()}`, {
                    method: 'GET',
                });

                if (response?.success && response.data) {
                    set_all_orders(response.data.items);
                    setTotal_orders(response.data.total);
                }
            } catch {
                set_all_orders([]);
                setTotal_orders(0);
            } finally {
                set_load_all_orders(false);
            }
        },
        [find_orders, total_orders],
    );

    const { request: get_stats } = useApi<Stats[]>();

    const getStats = useCallback(async () => {
        setLoadStat(true);
        try {
            const response = await get_stats(GET_STATS_ENDPOINT, { method: 'GET' });
            if (response?.success) {
                setStats(response.data);
            }
        } catch {
            setStats([]);
        } finally {
            setLoadStat(false);
        }
    }, [get_stats]);

    const initAuth = useCallback(async () => {
        setLoading(true);

        try {
            const token = await getAccessToken();

            if (!token) {
                setIsAuthenticated(false);
                clearToken();
                setLoading(false);
                return;
            }
            setIsAuthenticated(true);

            await Promise.all([
                getStats(),
                get_order_dashboard(),
                get_all_orders(1, 10),
                get_admin_data()
            ]);
        } catch {
            setIsAuthenticated(false);
            clearToken();
        } finally {
            setLoading(false);
        }
    }, [get_order_dashboard, get_all_orders, getStats, get_admin_data]);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            // Evite l'appel API refresh-token (et l'erreur 401) pour les visiteurs publics
            if (!window.location.pathname.startsWith('/administrator')) {
                if (isMounted) setLoading(false);
                return;
            }

            if (isMounted) {
                await initAuth();
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [initAuth]);

    const login = async (token: string) => {
        setToken(token);
        setIsAuthenticated(true);
        getStats();
        get_order_dashboard();
        get_all_orders(1, 10);
    };

    const logout = () => {
        clearToken();
        setAdmin(null);
        setStats([]);
        set_all_orders([]);
        set_order_dashboard([]);
        setIsAuthenticated(false);
    };

    const reload_get_orders = async (
        type: 'dashboard' | 'all',
        page: number = 1,
        limit: number,
        search: string = '',
        status: string = 'all',
    ) => {
        const params = new URLSearchParams();

        if (type === 'all') {
            const skip = (page - 1) * limit;
            set_reload_all_orders(true);
            params.set('skip', skip.toString());
            params.set('limit', limit.toString());
            if (search) params.set('search', search);
            if (status && status !== 'all') params.set('status', status);
        } else {
            set_reload_order_dashboard(true);
            params.set('skip', '0');
            params.set('limit', '10');
        }

        try {
            const response = await find_orders(`${FIND_ORDERS_ENDPOINT}?${params.toString()}`, {
                method: 'GET',
            });
            if (response?.success) {
                if (type === 'all') {
                    set_all_orders(response.data.items);
                    setTotal_orders(response.data.total);
                } else {
                    set_order_dashboard(response.data.items);
                    setTotal_orders(response.data.total);
                }
            }
        } catch {
            if (type === 'all') {
                set_all_orders([]);
                setTotal_orders(0);
            } else {
                set_order_dashboard([]);
                setTotal_orders(0);
            }
        } finally {
            if (type === 'all') {
                set_reload_all_orders(false);
            } else {
                set_reload_order_dashboard(false);
            }
        }
    };


    const deleteOrder = async (order_id: number) => {
        const newListAllOrder = all_orders.filter((order) => order.id != order_id);
        set_all_orders(newListAllOrder);

        if (orders_dashboard.length > 5) {
            const newListAllOrderDashboard = orders_dashboard.filter(
                (order) => order.id != order_id,
            );
            set_order_dashboard(newListAllOrderDashboard);
        } else {
            const response = await find_orders(`${FIND_ORDERS_ENDPOINT}?skip=0&limit=10`, {
                method: 'GET',
            });

            if (response?.success) {
                set_order_dashboard(response.data.items);
                setTotal_orders(response.data.total);
            } else {
                //console.log('ERROR = ', response?.message);
            }
        }
    };

    const updateData = (data: Order) => {
        set_order_dashboard((prev) => [data, ...prev]);
        set_all_orders((prev) => [data, ...prev]);
    };

    const updateStatus = async (order_id: number, status: OrderStatus) => {
        set_order_dashboard((prev) => prev.map(o => o.id === order_id ? { ...o, status } : o));
        set_all_orders((prev) => prev.map(o => o.id === order_id ? { ...o, status } : o));

        try {
            const response = await get_stats(GET_STATS_ENDPOINT, { method: 'GET' });
            if (response?.success && response.data) {
                setStats(response.data);
            }
        } catch (err) {
            console.error("Erreur mise à jour statut", err);
        }
    };

    const updateAdmin = (admin: AdminData | null) => {
        setAdmin(admin);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,

                admin,

                loadStat,
                stats,

                orders_dashboard,
                load_order_dashboard,
                reload_order_dashboard,

                all_orders,
                total_orders,
                load_all_orders,
                reload_all_orders,
                get_all_orders,

                reload_get_orders,
                deleteOrder,
                updateData,
                updateStatus,

                updateAdmin,

                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function UseAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}
