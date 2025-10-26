/**
 * 에러 처리 유틸리티
 */

/**
 * 에러 객체를 안전하게 문자열로 변환합니다.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unknown error occurred';
}

/**
 * 에러 코드를 추출합니다.
 */
export function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    return String(error.code);
  }

  return undefined;
}

/**
 * API 에러 응답을 생성합니다.
 */
export function createApiErrorResponse(message: string, code?: string, status: number = 500, details?: unknown) {
  return {
    success: false as const,
    error: message,
    code,
    details,
    status,
  };
}

/**
 * 성공 응답을 생성합니다.
 */
export function createApiSuccessResponse<T>(data: T) {
  return {
    success: true as const,
    data,
  };
}

/**
 * 관심종목 관련 에러 메시지를 생성합니다.
 */
export function getWatchlistErrorMessage(error: unknown): string {
  const message = getErrorMessage(error);
  const code = getErrorCode(error);

  switch (code) {
    case 'WATCHLIST_LIMIT_EXCEEDED':
      return 'Maximum watchlist items reached (50 items limit)';
    case 'WATCHLIST_DUPLICATE':
      return 'This stock is already in your watchlist';
    case 'UNAUTHORIZED':
      return 'Please sign in to manage your watchlist';
    case 'VALIDATION_ERROR':
      return 'Invalid stock symbol or company name';
    default:
      return message || 'Failed to update watchlist';
  }
}

/**
 * 네트워크 에러를 확인합니다.
 */
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('connection')
  );
}

/**
 * 인증 에러를 확인합니다.
 */
export function isAuthError(error: unknown): boolean {
  const code = getErrorCode(error);
  return code === 'UNAUTHORIZED' || code === 'AUTH_ERROR';
}
