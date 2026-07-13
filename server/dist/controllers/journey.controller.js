import { sendSuccess, sendError } from '../utils/response';
import { dbGetJourneyTimeline } from '../database/journeyDbUtils';
import { generateWeeklyLetter } from '../services/ai/weeklyLetter.service';
export async function getJourney(req, res) {
    if (!req.user) {
        sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401);
        return;
    }
    const userId = req.user.userId;
    try {
        // Generate/fetch weekly letter in background to not block the request
        void generateWeeklyLetter(userId).catch(err => {
            console.error('Background letter generation failed:', err);
        });
        const timeline = await dbGetJourneyTimeline(userId);
        sendSuccess(res, timeline);
    }
    catch (error) {
        console.error('Failed to get journey timeline:', error);
        sendError(res, "We're having trouble loading your journey. Please try again.", 'SERVER_ERROR', 500);
    }
}
//# sourceMappingURL=journey.controller.js.map