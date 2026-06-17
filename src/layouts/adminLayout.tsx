import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CosmosLogo } from '@/components/icons';
import {
    LogOut,
    LayoutDashboard,
    Menu,
    X,
    FolderOpenDot,
    Sun,
    Moon,
    Monitor,
    Settings,
} from 'lucide-react';
import { LogoutDialog } from '@/components/admin/ConfirmLogout';
import { ADMIN_DASHBOARD_PATH, ADMIN_ORDER_PATH, ADMIN_SETTINGS_PATH, LOGIN_PATH } from '@/routes';
import { LOGOUT_ENDPOINT, useApi } from '@/hooks/UseApi';
import { UseAuth } from '@/context/AuthContext';
import { UseTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import ScrollToTop from '@/components/ScrollToTop';

export default function AdminLayout() {
    const { theme, setTheme } = UseTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        {
            name: 'Tableau de bord',
            path: ADMIN_DASHBOARD_PATH,
            icon: LayoutDashboard,
        },
        {
            name: 'Commandes',
            path: ADMIN_ORDER_PATH,
            icon: FolderOpenDot,
        },
        {
            name: 'Paramètres',
            path: ADMIN_SETTINGS_PATH,
            icon: Settings,
        },
    ];

    const isActive = (path: string) => location.pathname === path;

    const [loading, setLoading] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const { logout } = UseAuth();
    const { request } = useApi<null>();
    const onConfirmLogout = async () => {
        setLoading(true);
        try {
            const response = await request(LOGOUT_ENDPOINT, { method: 'POST' });
            if (response?.success) {
                logout();
                setTimeout(() => navigate(LOGIN_PATH, { replace: true }), 1000);
            }
        } catch (err: unknown) {
            console.log(err);
        } finally {
            setLoading(true);
            setOpen(false);
        }
    };

    const changeTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    return (
        <main className="relative min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
            <ScrollToTop />
            {/* Navbar */}
            <header className="w-full h-18 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/15 transition-colors duration-300 z-50">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3 group shrink-0">
                        <div className="relative">
                            <CosmosLogo className="w-8 h-8 text-[#d4b96a] transition-transform duration-700 group-hover:rotate-180" />
                            <div className="absolute inset-0 bg-[#d4b96a]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="font-display text-lg font-medium text-zinc-900 dark:text-[#fafafa] tracking-tight">
                            Ton Cosmos{' '}
                            <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-[#52525b] ml-1 font-bold">
                                Admin
                            </span>
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                ${
                                    isActive(link.path)
                                        ? 'bg-zinc-100 dark:bg-white/10 text-[#d4b96a]'
                                        : 'text-zinc-500 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#fafafa] hover:bg-zinc-100 dark:hover:bg-white/5'
                                }
                            `}
                            >
                                <link.icon size={16} />
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="relative flex items-center gap-2 sm:gap-4">
                        <Button
                            onClick={changeTheme}
                            variant="outline"
                            size="icon-lg"
                            className="border border-zinc-300 dark:border-zinc-700"
                        >
                            {theme === 'light' ? (
                                <Sun size={22} />
                            ) : theme === 'dark' ? (
                                <Moon size={22} />
                            ) : (
                                <Monitor size={22} />
                            )}
                        </Button>

                        <button
                            onClick={() => setOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500/80 dark:text-red-400/80 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all cursor-pointer group"
                        >
                            <LogOut
                                size={16}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            <span>Déconnexion</span>
                        </button>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-zinc-500 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#fafafa] hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                <div
                    className={`absolute top-18 left-0 w-full bg-white dark:bg-[#09090b] border-b border-zinc-200 dark:border-white/5 md:hidden transition-all duration-300 ease-in-out overflow-hidden shadow-xl dark:shadow-none ${
                        isMenuOpen
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                >
                    <nav className="flex flex-col p-4 gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors
                                ${
                                    isActive(link.path)
                                        ? 'bg-[#d4b96a]/10 text-[#d4b96a]'
                                        : 'text-zinc-600 dark:text-[#a1a1aa] hover:bg-zinc-50 dark:hover:bg-white/5'
                                }
                            `}
                            >
                                <link.icon size={20} />
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-zinc-100 dark:bg-white/5 my-2" />
                        <button
                            onClick={() => setOpen(true)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-500/80 dark:text-red-400/80 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                        >
                            <LogOut size={20} />
                            Déconnexion
                        </button>
                    </nav>
                </div>

                <LogoutDialog
                    loading={loading}
                    isOpen={isOpen}
                    onConfirm={(value: boolean) => {
                        if (value) {
                            onConfirmLogout();
                        } else {
                            setOpen(false);
                        }
                    }}
                />
            </header>

            <div className="max-w-350 mx-auto px-5 py-8">
                <Outlet />
            </div>
        </main>
    );
}
