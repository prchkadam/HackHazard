export function sendSuccess(res, data, statusCode = 200) {
    res.status(statusCode).json({ success: true, data });
}
export function sendError(res, message, errorCode, statusCode = 500) {
    res.status(statusCode).json({ success: false, message, errorCode });
}
//# sourceMappingURL=response.js.map