import type { Request, Response, NextFunction } from 'express';
export interface JwtPayload {
    userId: string;
    isGuest: boolean;
}
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
export declare function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=jwt.d.ts.map