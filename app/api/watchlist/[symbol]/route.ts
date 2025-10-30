import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { authenticateRequest } from '@/lib/middleware/api-auth';
import { checkRateLimit } from '@/lib/middleware/rateLimit';
import { validateApiResponse, validateRequestBody } from '@/lib/middleware/validation';
import {
  AddWatchlistItemSchema,
  AddWatchlistResponseSchema,
  ApiErrorSchema,
  RemoveWatchlistResponseSchema,
} from '@/lib/schemas/watchlist';

/**
 * POST /api/watchlist/[symbol]
 * 특정 주식을 관심종목에 추가합니다.
 *
 * Rate Limit: 60 requests per minute (modify operations)
 * Authentication: Required
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> | { symbol: string } },
) {
  let userId: string | null = null;
  const resolvedParams = params instanceof Promise ? await params : params;

  try {
    // Authentication validation (T022)
    const { user, error: authError } = await authenticateRequest(request);
    if (authError || !user) {
      return authError || NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    userId = user.id;

    // Rate limiting (T020) - Modify operations: 60 req/min
    const rateLimitConfig = {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60, // contracts specifies 60 req/min for modify operations
    };
    const rateLimitResult = checkRateLimit(userId, rateLimitConfig);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many watchlist modifications, please wait before trying again',
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

    // Request body validation using Zod schemas (T018)
    const validateRequest = validateRequestBody(AddWatchlistItemSchema);
    const { data: validatedData, error: validationError } = await validateRequest(request);

    if (validationError || !validatedData) {
      return (
        validationError ||
        NextResponse.json(
          {
            success: false,
            error: 'Invalid symbol or company name',
            code: 'VALIDATION_ERROR',
          },
          { status: 400 },
        )
      );
    }

    // Override symbol from URL params
    const finalSymbol = resolvedParams.symbol.toUpperCase().trim();
    validatedData.symbol = finalSymbol;

    // 관심종목 추가
    const watchlistItem = await addToWatchlist(userId, validatedData.symbol, validatedData.company);

    // Format response data
    const responseData = {
      success: true as const,
      data: {
        message: 'Stock added to watchlist',
        watchlistItem: {
          symbol: watchlistItem.symbol,
          company: watchlistItem.company,
          addedAt: watchlistItem.addedAt.toISOString(),
        },
      },
    };

    // Response validation using Zod schemas (T018)
    const validationResult = validateApiResponse(AddWatchlistResponseSchema, responseData);
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
    console.error('[API Error] POST /api/watchlist/[symbol]:', errorMessage);

    // Standardized error response formatting (T019)
    let errorResponse: { success: false; error: string; code: string } = {
      success: false,
      error: 'Failed to add stock to watchlist',
      code: 'INTERNAL_ERROR',
    };

    // Handle specific error types
    if (error instanceof z.ZodError) {
      errorResponse = {
        success: false,
        error: 'Invalid symbol or company name',
        code: 'VALIDATION_ERROR',
      };
    } else if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      errorResponse = {
        success: false,
        error: 'Stock already in watchlist',
        code: 'DUPLICATE_ERROR',
      };
      const errorValidation = validateApiResponse(ApiErrorSchema, errorResponse);
      return NextResponse.json(errorValidation.validatedData || errorResponse, { status: 409 });
    } else if (error instanceof Error && error.message?.includes('limit')) {
      errorResponse = {
        success: false,
        error: 'Watchlist limit reached (50 stocks)',
        code: 'LIMIT_EXCEEDED',
      };
      const errorValidation = validateApiResponse(ApiErrorSchema, errorResponse);
      return NextResponse.json(errorValidation.validatedData || errorResponse, { status: 413 });
    }

    // Validate error response format
    const errorValidation = validateApiResponse(ApiErrorSchema, errorResponse);
    return NextResponse.json(errorValidation.validatedData || errorResponse, { status: 500 });
  }
}

/**
 * DELETE /api/watchlist/[symbol]
 * 특정 주식을 관심종목에서 제거합니다.
 *
 * Rate Limit: 60 requests per minute (modify operations)
 * Authentication: Required
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> | { symbol: string } },
) {
  let userId: string | null = null;
  const resolvedParams = params instanceof Promise ? await params : params;

  try {
    // Authentication validation (T022)
    const { user, error: authError } = await authenticateRequest(request);
    if (authError || !user) {
      return authError || NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    userId = user.id;

    // Rate limiting (T020) - Modify operations: 60 req/min
    const rateLimitConfig = {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60, // contracts specifies 60 req/min for modify operations
    };
    const rateLimitResult = checkRateLimit(userId, rateLimitConfig);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many watchlist modifications, please wait before trying again',
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

    // Symbol validation
    const symbol = resolvedParams.symbol.toUpperCase().trim();
    if (!symbol || symbol.length === 0 || symbol.length > 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid symbol',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 },
      );
    }

    // 관심종목 제거
    const result = await removeFromWatchlist(userId, symbol);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Stock not found in watchlist',
          code: 'NOT_FOUND',
        },
        { status: 404 },
      );
    }

    // Format response data
    const responseData = {
      success: true as const,
      data: {
        message: 'Stock removed from watchlist',
        symbol,
      },
    };

    // Response validation using Zod schemas (T018)
    const validationResult = validateApiResponse(RemoveWatchlistResponseSchema, responseData);
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
    console.error('[API Error] DELETE /api/watchlist/[symbol]:', errorMessage);

    // Standardized error response formatting (T019)
    const errorResponse: { success: false; error: string; code: string } = {
      success: false,
      error: 'Failed to remove stock from watchlist',
      code: 'INTERNAL_ERROR',
    };

    // Validate error response format
    const errorValidation = validateApiResponse(ApiErrorSchema, errorResponse);
    return NextResponse.json(errorValidation.validatedData || errorResponse, { status: 500 });
  }
}
