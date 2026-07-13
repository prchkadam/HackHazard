import type { Response } from 'express';
import type { AuthenticatedRequest } from '../utils/jwt';
export declare function googleLogin(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function guestLogin(_req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getMe(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function logout(_req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map