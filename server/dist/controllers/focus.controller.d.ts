import type { Response } from 'express';
import type { AuthenticatedRequest } from '../utils/jwt';
export declare function createSession(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateSession(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function submitReflection(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=focus.controller.d.ts.map