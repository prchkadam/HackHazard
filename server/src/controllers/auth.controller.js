import { authenticateWithGoogle, authenticateGuest, getUserById } from '../services/auth.services';
import { sendSuccess, sendError } from '../utils/response';
export async function googleLogin(req, res) {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            sendError(res, 'Google token is required', 'TOKEN_INVALID', 400);
            return;
        }
        const result = await authenticateWithGoogle(idToken);
        sendSuccess(res, result);
    }
    catch {
        sendError(res, 'Google sign-in failed. Please try again.', 'TOKEN_INVALID', 401);
    }
}
export async function guestLogin(_req, res) {
    try {
        const result = await authenticateGuest();
        sendSuccess(res, result);
    }
    catch {
        sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
    }
}
export async function getMe(req, res) {
    try {
        if (!req.user) {
            sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401);
            return;
        }
        const user = await getUserById(req.user.userId);
        if (!user) {
            sendError(res, "We couldn't find your account.", 'USER_NOT_FOUND', 404);
            return;
        }
        sendSuccess(res, user);
    }
    catch {
        sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
    }
}
export async function logout(_req, res) {
    sendSuccess(res, { message: 'Logged out' });
}
//# sourceMappingURL=auth.controller.js.map