import { type NextRequest, NextResponse } from 'next/server';

/**
 * 사용자별 속도 제한 미들웨어
 */

interface RateLimitConfig {
  windowMs: number; // 시간 윈도우 (밀리초)
  maxRequests: number; // 최대 요청 수
  message?: string; // 제한 초과 시 메시지
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// 메모리 기반 저장소 (프로덕션에서는 Redis 사용 권장)
const rateLimitStore = new Map<string, RateLimitEntry>();

// 기본 설정
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15분
  maxRequests: 100, // 최대 100회 요청
  message: 'Too many requests, please try again later',
};

/**
 * 사용자별 속도 제한 설정
 */
const WATCHLIST_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // 관심종목 추가/제거는 더 엄격한 제한
  'watchlist-modify': {
    windowMs: 60 * 1000, // 1분
    maxRequests: 10, // 최대 10회
    message: 'Too many watchlist modifications, please wait before trying again',
  },
  // 상태 확인은 더 관대한 제한
  'watchlist-status': {
    windowMs: 60 * 1000, // 1분
    maxRequests: 60, // 최대 60회
    message: 'Too many status checks, please wait before trying again',
  },
  // 일반 API 요청
  'api-general': {
    windowMs: 15 * 60 * 1000, // 15분
    maxRequests: 100, // 최대 100회
    message: 'Too many API requests, please try again later',
  },
};

/**
 * 사용자별 속도 제한을 확인합니다.
 */
export function checkRateLimit(
  userId: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const key = `${userId}:${config.windowMs}`;
  const entry = rateLimitStore.get(key);

  // 새로운 윈도우 시작
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // 기존 윈도우에서 요청 수 증가
  entry.count++;

  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * 속도 제한 미들웨어
 */
export function withRateLimit(
  config: RateLimitConfig = DEFAULT_CONFIG,
  getUserIdentifier: (request: NextRequest) => string,
) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) =>
    async (request: NextRequest): Promise<NextResponse> => {
      const userId = getUserIdentifier(request);

      if (!userId) {
        return NextResponse.json(
          {
            success: false,
            error: 'User identification required for rate limiting',
            code: 'RATE_LIMIT_ERROR',
          },
          { status: 401 },
        );
      }

      const rateLimitResult = checkRateLimit(userId, config);

      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: config.message || 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: rateLimitResult.retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
            },
          },
        );
      }

      // 응답에 속도 제한 헤더 추가
      const response = await handler(request);

      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

      return response;
    };
}

/**
 * 관심종목 수정용 속도 제한
 */
export const withWatchlistModifyRateLimit = withRateLimit(
  WATCHLIST_RATE_LIMITS['watchlist-modify'],
  (request: NextRequest) => {
    // 실제로는 인증된 사용자 ID를 사용해야 함
    return request.headers.get('x-user-id') || 'anonymous';
  },
);

/**
 * 관심종목 상태 확인용 속도 제한
 */
export const withWatchlistStatusRateLimit = withRateLimit(
  WATCHLIST_RATE_LIMITS['watchlist-status'],
  (request: NextRequest) => {
    return request.headers.get('x-user-id') || 'anonymous';
  },
);

/**
 * 일반 API용 속도 제한
 */
export const withApiRateLimit = withRateLimit(WATCHLIST_RATE_LIMITS['api-general'], (request: NextRequest) => {
  return request.headers.get('x-user-id') || 'anonymous';
});

/**
 * 속도 제한 저장소 정리 (메모리 누수 방지)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * 정기적으로 저장소를 정리하는 함수
 */
export function startRateLimitCleanup(): void {
  // 5분마다 정리
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
