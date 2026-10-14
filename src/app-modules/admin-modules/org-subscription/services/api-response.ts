/**
 * The tenant API reports failure in three shapes:
 *  - HTTP 200 with `{isSuccess: false, message}` (legacy controllers),
 *  - ProblemDetails `{title, detail, code}` from the global exception handler (422 carries a user-facing `detail`),
 *  - ValidationProblemDetails `{errors: {Field: [msg]}}` from model validation (400).
 */
export const ensureSuccess = <T = any>(resp: any): T => {
    if (resp && resp.isSuccess === false) {
        throw {status: 200, error: resp, message: resp.message || 'Request was rejected by the server.'};
    }
    return resp;
};

export const errorMessageOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object'
        ? Object.values(body.errors).flat().filter(Boolean).join(' ')
        : null;
    return validation || body?.detail || body?.message || body?.Message || (typeof body === 'string' ? body : null) || fallback;
};

/** A new key per purchase attempt; the same key is resent on retry so the API never bills twice. */
export const newIdempotencyKey = (): string =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
