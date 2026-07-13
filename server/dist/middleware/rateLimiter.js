const store = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;
export function rateLimiter(req, res, next) {
    const ip = req.ip ?? 'unknown';
    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || now > entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        next();
        return;
    }
    if (entry.count >= MAX_REQUESTS) {
        res.status(429).json({
            success: false,
            message: "You're sending too many requests. Please wait a moment and try again.",
            errorCode: 'RATE_LIMIT_EXCEEDED',
        });
        return;
    }
    entry.count += 1;
    next();
}
//# sourceMappingURL=rateLimiter.js.map