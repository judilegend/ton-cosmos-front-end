import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export default function AlertMessage({
    title,
    description,
    className,
    variant = 'destructive',
}: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
    className: string;
}) {
    return (
        <Alert variant={variant} className={className}>
            <AlertTitle className="flex items-center gap-x-2.5 mb-2.5">
                <AlertCircleIcon size={20} /> {title}
            </AlertTitle>
            <AlertDescription className=""> {description} </AlertDescription>
        </Alert>
    );
}
