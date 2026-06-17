import { BASE_USER_API, REFRESH_TOKEN_ENDPOINT } from '@/hooks/UseApi';

const TOKEN_KEY = 'ton-cosmos-access';

export const setToken = (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
    sessionStorage.removeItem(TOKEN_KEY);
};

const isExpired = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 - 60000 < Date.now();
    } catch {
        return true;
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (!token) return null;

    if (!isExpired(token)) {
        return token;
    }

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
