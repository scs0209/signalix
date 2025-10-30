import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getWatchlist } from '@/lib/actions/watchlist.actions';
import { authenticateRequest } from '@/lib/middleware/api-auth';
import { checkRateLimit } from '@/lib/middleware/rateLimit';
import { validateApiResponse } from '@/lib/middleware/validation';
import { ApiErrorSchema, WatchlistResponseSchema } from '@/lib/schemas/watchlist';

/**
 * GET /api/watchlist
 * 현재 사용자의 관심종목 목록을 조회합니다.
 *
 * Rate Limit: 300 requests per minute (read operations)
 * Authentication: Required
 */
export async function GET(request: NextRequest) {
  let userId: string | null = null;

  try {
    // Authentication validation (T022)
    const { user, error: authError } = await authenticateRequest(request);
    if (authError || !user) {
      return authError || NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    userId = user.id;

    // Rate limiting (T020) - Read operations: 300 req/min
    const rateLimitConfig = {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 300, // contracts specifies 300 req/min for read operations
    };
    const rateLimitResult = checkRateLimit(userId, rateLimitConfig);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests, please try again later',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        },
      );
    }

    // 관심종목 목록 조회
    const watchlist = await getWatchlist(userId);

    // Format response data
    const responseData = {
      success: true as const,
      data: {
        watchlist: watchlist.map((item) => ({
          symbol: item.symbol,
          company: item.company,
          addedAt: item.addedAt.toISOString(),
        })),
        count: watchlist.length,
      },
    };

    // Response validation using Zod schemas (T018)
    const validationResult = validateApiResponse(WatchlistResponseSchema, responseData);
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error: Invalid response format',
          code: 'VALIDATION_ERROR',
        },
        { status: 500 },
      );
    }

    // Return response with rate limit headers (T020)
    return NextResponse.json(validationResult.validatedData, {
      headers: {
        'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API Error] GET /api/watchlist:', errorMessage);

    // Standardized error response formatting (T019)
    const errorResponse: { success: false; error: string; code?: string } = {
      success: false,
      error: 'Failed to fetch watchlist',
      code: 'INTERNAL_ERROR',
    };

    // Validate error response format
    const errorValidation = validateApiResponse(ApiErrorSchema, errorResponse);
    return NextResponse.json(errorValidation.validatedData || errorResponse, { status: 500 });
  }
}
