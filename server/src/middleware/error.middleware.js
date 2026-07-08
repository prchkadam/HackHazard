import { sendError } from '../utils/response';
export function errorHandler(err, _req, res, _next) {
    const message = err.message;
    if (message === 'MENTOR_NOT_FOUND') {
        sendError(res, "We couldn't find that mentor. Please try again.", 'MENTOR_NOT_FOUND', 404);
        return;
    }
    if (message === 'USER_NOT_FOUND') {
        sendError(res, "We couldn't find your account.", 'USER_NOT_FOUND', 404);
        return;
    }
    if (message.includes('Google') || message.includes('token')) {
        sendError(res, 'Google sign-in failed. Please try again.', 'TOKEN_INVALID', 401);
        return;
    }
    sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
}
//# sourceMappingURL=error.middleware.js.map