/*
 * Copyright (c) 2025–2026 Paul Viandier
 * All rights reserved.
 *
 * This source code is proprietary.
 * Commercial use, redistribution, or modification is strictly prohibited
 * without prior written permission.
 *
 * See the LICENSE file in the project root for full license terms.
 */

export type APIErrorCode =
    | 'RATE_LIMIT'
    | 'NOT_FOUND'
    | 'UNAUTHORIZED'
    | 'SERVER_ERROR'
    | 'NETWORK_ERROR'
    | 'INVALID_RANGE'
    | 'INVALID_PARAMS'
    | 'INVALID_REPOS'
    | 'INVALID_SHA'
    | 'SERVICE_UNAVAILABLE';

export interface APIErrorPayload {
    error: string;
    code: APIErrorCode;
    retryAfter?: number;
}

export const API_ERRORS: Record<APIErrorCode, { message: string; status: number }> = {
    RATE_LIMIT: { message: 'Too many requests', status: 429 },
    NOT_FOUND: { message: 'Not found', status: 404 },
    UNAUTHORIZED: { message: 'Unauthorized', status: 403 },
    SERVER_ERROR: { message: 'Server error', status: 500 },
    NETWORK_ERROR: { message: 'Network error', status: 502 },
    INVALID_RANGE: { message: 'Invalid range', status: 400 },
    INVALID_PARAMS: { message: 'Invalid params', status: 400 },
    INVALID_REPOS: { message: 'No valid repos', status: 400 },
    INVALID_SHA: { message: 'Invalid SHA', status: 400 },
    SERVICE_UNAVAILABLE: { message: 'Service temporarily unavailable', status: 503 }
};

export function apiErrorPayload(
    code: APIErrorCode,
    overrides?: { message?: string; retryAfter?: number; status?: number }
): APIErrorPayload & { status: number } {
    const { message, status } = API_ERRORS[code];
    return {
        error: overrides?.message ?? message,
        code,
        status: overrides?.status ?? status,
        ...(
            overrides?.retryAfter !== undefined && { retryAfter: overrides.retryAfter }
        )
    };
}

export function apiError(
    code: APIErrorCode,
    overrides?: { message?: string; retryAfter?: number; status?: number }
): { payload: APIErrorPayload; status: number } {
    const result = apiErrorPayload(code, overrides);
    const { status, ...payload } = result;
    return { payload, status };
}
