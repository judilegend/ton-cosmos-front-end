import { BASE_USER_API, REFRESH_TOKEN_ENDPOINT } from '@/hooks/UseApi';

/**
 * Token store memory-only.
 * L'access token n'est JAMAIS écrit dans sessionStorage ni localStorage.
 * Un XSS ne peut donc pas le lire. La session survit grâce au
 * refresh token httpOnly géré par le backend.
 */
let _accessToken: string | null = null;

export const setToken = (token: string): void => {
    _accessToken = token;
};

export const clearToken = (): void => {
    _accessToken = null;
};

const isExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 - 60000 < Date.now();
    } catch {
        return true;
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    // Token en mémoire valide : on le renvoie directement
    if (_accessToken && !isExpired(_accessToken)) {
        return _accessToken;
    }

    // Token absent ou expiré : on tente un silent refresh via le cookie httpOnly
    try {
        const res = await fetch(`${BASE_USER_API}${REFRESH_TOKEN_ENDPOINT}`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!res.ok) {
            clearToken();
            return null;
        }

        const json = await res.json();

        if (!json?.success || !json?.data?.access_token) {
            clearToken();
            return null;
        }

        const newToken = json.data.access_token;
        setToken(newToken);

        return newToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        clearToken();
        return null;
    }
};
