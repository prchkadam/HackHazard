import type { Response } from 'express';
import type { AuthenticatedRequest } from '../utils/jwt';
export declare function getProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function patchProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map