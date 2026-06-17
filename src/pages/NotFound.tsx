import { Button } from '@/components/ui/button';
import { ChevronLeft, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-zinc-50 dark:bg-[#09090b] selection:bg-[#d4b96a]/30 transition-colors duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#d4b96a]/10 dark:from-[#d4b96a]/5 via-transparent to-transparent -z-10" />

            <div className="relative mb-8">
                <div className="w-20 h-20 bg-[#d4b96a]/10 border border-[#d4b96a]/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <SearchX size={32} className="text-[#d4b96a]" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4b96a] rounded-full blur-[2px] animate-pulse opacity-40 dark:opacity-50" />
            </div>

            <span className="text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-zinc-500 dark:text-[#52525b] mb-6 shadow-sm dark:shadow-none">
                Status 404
            </span>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-zinc-900 dark:text-[#fafafa] mb-5">
                Destination inconnue
            </h1>

            <p className="text-sm md:text-base text-zinc-500 dark:text-[#a1a1aa] max-w-md mb-10 leading-relaxed font-light">
                La page que vous tentez de consulter n'existe pas ou a été déplacée. Vérifiez
                l'adresse ou laissez-vous guider vers un point de départ connu.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="text-sm text-zinc-500 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#fafafa] hover:bg-zinc-200 dark:hover:bg-white/5 transition-all gap-2 h-11"
                >
                    <ChevronLeft size={16} />
                    Retour
                </Button>
            </div>

            {/* Footer / Branding */}
            <div className="absolute bottom-8 left-0 right-0">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-medium">
                    Cosmos Admin • Systèmes
                </p>
            </div>
        </main>
    );
}
