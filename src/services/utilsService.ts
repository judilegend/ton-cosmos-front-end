export const MaskingService = {
    /**
     * Masque un nom complet.
     * RAHARISON Joshue Agape -> RA****************PE
     */
    maskName: (name: string): string => {
        if (!name || name.length <= 4) return name;

        const firstTwo = name.substring(0, 2);
        const lastTwo = name.substring(name.length - 2);
        const maskLength = name.length - 4;

        return `${firstTwo}${'*'.repeat(maskLength)}${lastTwo}`;
    },

    /**
     * Masque un email.
     * agapedev.dark@gmail.com -> aga*****@gmail.com
     */
    maskEmail: (email: string): string => {
        if (!email || !email.includes('@')) return email;

        const [localPart, domain] = email.split('@');

        if (localPart.length <= 3) {
            return `${localPart[0]}***@${domain}`;
        }

        const visiblePart = localPart.substring(0, 3);
        return `${visiblePart}*****@${domain}`;
    },
};
