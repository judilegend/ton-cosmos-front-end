import {
    ZodiacAquarius,
    ZodiacAries,
    ZodiacCancer,
    ZodiacCapricorn,
    ZodiacGemini,
    ZodiacLeo,
    ZodiacLibra,
    ZodiacPisces,
    ZodiacSagittarius,
    ZodiacScorpio,
    ZodiacTaurus,
    ZodiacVirgo,
} from 'lucide-react';

export const CosmosLogo = ({ className = 'w-8 h-8' }: { className?: string }) => {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
            <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
                </linearGradient>
            </defs>
            {/* Outer ring */}
            <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="1" opacity="0.6" />
            {/* Middle ring */}
            <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            {/* Inner dot */}
            <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.9" />
            {/* Orbit markers */}
            <circle cx="20" cy="2" r="1.5" fill="currentColor" opacity="0.7" />
            <circle cx="38" cy="20" r="1" fill="currentColor" opacity="0.5" />
            <circle cx="20" cy="38" r="1" fill="currentColor" opacity="0.5" />
            <circle cx="2" cy="20" r="1.5" fill="currentColor" opacity="0.7" />
        </svg>
    );
};

export const ZodiacWheel = ({ className = 'w-64 h-64' }: { className?: string }) => {
    const signs = [
        ZodiacAries,
        ZodiacTaurus,
        ZodiacGemini,
        ZodiacCancer,
        ZodiacLeo,
        ZodiacVirgo,
        ZodiacLibra,
        ZodiacScorpio,
        ZodiacSagittarius,
        ZodiacCapricorn,
        ZodiacAquarius,
        ZodiacPisces,
    ];

    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="wheelGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#d4b96a" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d4b96a" stopOpacity="0.24" />
                </linearGradient>
            </defs>

            {/* Rings */}
            <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="#d4b96a"
                strokeOpacity="0.20"
                strokeWidth="0.5"
            />
            <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#d4b96a"
                strokeOpacity="0.15"
                strokeWidth="0.5"
            />
            <circle
                cx="100"
                cy="100"
                r="55"
                fill="none"
                stroke="#d4b96a"
                strokeOpacity="0.10"
                strokeWidth="0.5"
            />
            <circle
                cx="100"
                cy="100"
                r="30"
                fill="url(#wheelGrad)"
                stroke="#d4b96a"
                strokeOpacity="0.20"
                strokeWidth="0.5"
            />

            {/* Division lines */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x1 = 100 + 55 * Math.cos(angle);
                const y1 = 100 + 55 * Math.sin(angle);
                const x2 = 100 + 95 * Math.cos(angle);
                const y2 = 100 + 95 * Math.sin(angle);

                return (
                    <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#d4b96a"
                        strokeOpacity="0.1"
                        strokeWidth="0.5"
                    />
                );
            })}

            {/* Zodiac icons */}
            {signs.map((Icon, i) => {
                const angle = (i * 30 + 15 - 90) * (Math.PI / 180);
                const x = 100 + 87 * Math.cos(angle);
                const y = 100 + 87 * Math.sin(angle);

                return (
                    <foreignObject key={i} x={x - 6} y={y - 6} width="12" height="12">
                        <div className="flex items-center justify-center">
                            <Icon size={10} className="text-purple-400" style={{ opacity: 1 }} />
                        </div>
                    </foreignObject>
                );
            })}

            {/* Planet dots */}
            {[35, 78, 145, 200, 260, 310].map((deg, i) => {
                const angle = (deg - 90) * (Math.PI / 180);
                const r = 30 + (i % 3) * 12;
                const x = 100 + r * Math.cos(angle);
                const y = 100 + r * Math.sin(angle);

                return <circle key={i} cx={x} cy={y} r="1.5" fill="#d4b96a" fillOpacity="0.5" />;
            })}
        </svg>
    );
};

export function OrnamentDivider({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center gap-4 ${className}`}>
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#d4b96a]/25" />
            <svg viewBox="0 0 16 16" className="w-3 h-3 text-[#d4b96a]/40">
                <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="8" cy="8" r="1" fill="currentColor" />
            </svg>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#d4b96a]/25" />
        </div>
    );
}

export function StarIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
            <path d="M8 0L9.796 6.204L16 8L9.796 9.796L8 16L6.204 9.796L0 8L6.204 6.204L8 0Z" />
        </svg>
    );
}
