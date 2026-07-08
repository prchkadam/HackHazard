export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ErrorCode =
  | 'AUTH_REQUIRED'
  | 'TOKEN_INVALID'
  | 'USER_NOT_FOUND'
  | 'MENTOR_NOT_FOUND'
  | 'MISSION_NOT_FOUND'
  | 'SERVER_ERROR'
  | 'DATABASE_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';
