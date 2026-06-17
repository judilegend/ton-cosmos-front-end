import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { LogOut, Loader2 } from 'lucide-react';

interface LogoutProps {
    loading: boolean;
    isOpen: boolean;
    onConfirm: (value: boolean) => void;
}

export function LogoutDialog({ loading, isOpen, onConfirm }: LogoutProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !loading && onConfirm(open)}>
            <DialogContent className="sm:max-w-100 gap-6">
                <DialogHeader className="flex flex-col items-center sm:items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>

                    <div className="space-y-1 text-center sm:text-left">
                        <DialogTitle className="text-xl font-semibold mb-3">
                            Se déconnecter
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-balance">
                            Êtes-vous sûr de vouloir quitter votre session ? Vous devrez saisir vos
                            identifiants pour revenir.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="py-2.5 flex flex-col-reverse sm:flex-row gap-2">
                    <Button
                        variant="ghost"
                        className="w-full sm:w-auto cursor-pointer"
                        onClick={() => onConfirm(false)}
                        disabled={loading}
                        style={{ height: '44px' }}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        className="w-full sm:w-auto min-w-35 cursor-pointer"
                        onClick={() => onConfirm(true)}
                        disabled={loading}
                        style={{ height: '44px' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Déconnexion...
                            </>
                        ) : (
                            'Se déconnecter'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
