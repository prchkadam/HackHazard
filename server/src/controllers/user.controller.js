import { getUserProfile, updateUserProfile } from '../services/auth.services';
import { sendSuccess, sendError } from '../utils/response';
export async function getProfile(req, res) {
    try {
        if (!req.user) {
            sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401);
            return;
        }
        const profile = await getUserProfile(req.user.userId);
        sendSuccess(res, profile);
    }
    catch (err) {
        if (err instanceof Error && err.message === 'USER_NOT_FOUND') {
            sendError(res, "We couldn't find your account.", 'USER_NOT_FOUND', 404);
            return;
        }
        sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
    }
}
export async function patchProfile(req, res) {
    try {
        if (!req.user) {
            sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401);
            return;
        }
        const { name, college, semester } = req.body;
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (college !== undefined)
            updates.college = college;
        if (semester !== undefined)
            updates.semester = semester;
        const user = await updateUserProfile(req.user.userId, updates);
        sendSuccess(res, user);
    }
    catch {
        sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
    }
}
//# sourceMappingURL=user.controller.js.map