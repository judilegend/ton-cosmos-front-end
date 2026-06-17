import { useCallback } from 'react';
import { getAccessToken } from '@/services/tokenService';

export const BASE_USER_API = import.meta.env.VITE_API_URL;
export const WEB_SOCKET_BASE = import.meta.env.VITE_WEBSOCKET_URL;

export const LOGIN_ENDPOINT = '/api/v1/admin/login';
export const REFRESH_TOKEN_ENDPOINT = '/api/v1/admin/refresh-token';
export const FORGOT_PASSWORD_ENDPOINT = '/api/v1/admin/forgot-password';
export const VERIFY_RESET_TOKEN_ENDPOINT = '/api/v1/admin/verify-reset-token';
export const RESET_PASSWORD_ENDPOINT = '/api/v1/admin/reset-password';
export const UPDATE_PASSWORD_ENDPOINT = '/api/v1/admin/update-password';
export const LOGOUT_ENDPOINT = '/api/v1/admin/logout';
export const CREATE_ORDER_ENDPOINT = '/api/v1/order/create';
export const CHECK_STRIPE_SESSION_ENDPOINT = '/api/v1/stripe/create-checkout-session';
export const FIND_ADMIN_DATA = '/api/v1/admin/data';
export const UPDATE_ADMIN_DATA = '/api/v1/admin/update-data';
export const FIND_ORDERS_ENDPOINT = '/api/v1/order/find-all';
export const GET_STATS_ENDPOINT = '/api/v1/order/stats';
export const DELETE_ORDER_ENDPOINT = (order_id: number) => `/api/v1/order/delete/${order_id}`;
export const RESET_ORDERS_ENDPOINT = (order_id: number) =>
    `/api/v1/stripe/resend-email/${order_id}`;

type ApiResponse<T> = {
    status_code: number;
    message: string;
    success: boolean;
    data: T;
};

type RequestOptions<TBody = unknown> = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: HeadersInit;
    body?: TBody;
};

export function useApi<T = unknown>() {
    const request = useCallback(
        async <TBody = unknown>(
            endpoint: string,
            options?: RequestOptions<TBody>,
        ): Promise<ApiResponse<T> | null> => {
            const isAuthRoute = [
                LOGIN_ENDPOINT,
                REFRESH_TOKEN_ENDPOINT,
                FORGOT_PASSWORD_ENDPOINT,
                VERIFY_RESET_TOKEN_ENDPOINT,
                RESET_PASSWORD_ENDPOINT,
            ].includes(endpoint);

            const token = isAuthRoute ? null : await getAccessToken();

            const headers = new Headers(options?.headers);
            headers.set('Content-Type', 'application/json');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            const res = await fetch(`${BASE_USER_API}${endpoint}`, {
                method: options?.method || 'GET',
                headers,
                credentials: 'include',
                body: options?.body ? JSON.stringify(options.body) : undefined,
            });

            const json: ApiResponse<T> = await res.json();
            return json;
        },
        [],
    );

    return { request };
}
