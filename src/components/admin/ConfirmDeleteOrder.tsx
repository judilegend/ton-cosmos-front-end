import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';

interface LogoutProps {
    loading: boolean;
    isOpen: boolean;
    onConfirm: (value: boolean) => void;
}

export function ConfirmDeleteOrder({ loading, isOpen, onConfirm }: LogoutProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !loading && onConfirm(open)}>
            <DialogContent className="sm:max-w-100 gap-6">
                <DialogHeader className="flex flex-col items-center sm:items-start gap-4">
                    {/* Icône de suppression (Rouge) */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>

                    <div className="space-y-1 text-center sm:text-left">
                        <DialogTitle className="text-xl font-semibold">
                            Supprimer la demande
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-balance">
                            Êtes-vous sûr de vouloir supprimer cette demande ? <br />
                            <span className="pt-3 font-medium text-red-600 dark:text-red-400">
                                Cette action est irréversible et les données seront perdues.
                            </span>
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
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
                                Suppression...
                            </>
                        ) : (
                            'Supprimer la demande'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
