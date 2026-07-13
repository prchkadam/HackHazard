import jwt from 'jsonwebtoken';
export function signToken(payload) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(payload, secret, { expiresIn: '7d' });
}
export function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.verify(token, secret);
}
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Authentication required', errorCode: 'AUTH_REQUIRED' });
        return;
    }
    try {
        const token = authHeader.slice(7);
        req.user = verifyToken(token);
        next();
    }
    catch {
        res.status(401).json({ success: false, message: 'Invalid or expired token', errorCode: 'TOKEN_INVALID' });
    }
}
//# sourceMappingURL=jwt.js.map