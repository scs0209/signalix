import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AddWatchlistItemSchema, ApiErrorSchema, WatchlistStatusSchema } from '@/lib/schemas/watchlist';

/**
 * 데이터 검증 미들웨어
 */

/**
 * 요청 본문을 Zod 스키마로 검증합니다.
 */
export function validateRequestBody<T>(schema: z.ZodSchema<T>) {
  return async (
    request: NextRequest,
  ): Promise<{
    data: T | null;
    error: NextResponse | null;
  }> => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);

      return {
        data: validatedData,
        error: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorResponse = {
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };

        return {
          data: null,
          error: NextResponse.json(errorResponse, { status: 400 }),
        };
      }

      return {
        data: null,
        error: NextResponse.json(
          {
            success: false,
            error: 'Invalid request body',
            code: 'INVALID_JSON',
          },
          { status: 400 },
        ),
      };
    }
  };
}

/**
 * URL 파라미터를 검증합니다.
 */
export function validateUrlParams<T>(schema: z.ZodSchema<T>) {
  return (
    params: Record<string, string | string[] | undefined>,
  ): {
    data: T | null;
    error: NextResponse | null;
  } => {
    try {
      const validatedData = schema.parse(params);

      return {
        data: validatedData,
        error: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorResponse = {
          success: false,
          error: 'Invalid URL parameters',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };

        return {
          data: null,
          error: NextResponse.json(errorResponse, { status: 400 }),
        };
      }

      return {
        data: null,
        error: NextResponse.json(
          {
            success: false,
            error: 'Invalid URL parameters',
            code: 'INVALID_PARAMS',
          },
          { status: 400 },
        ),
      };
    }
  };
}

/**
 * 범용 검증 함수들 - API에서 직접 사용
 */
export const validateRequest = validateRequestBody;
export const validateParams = validateUrlParams;

/**
 * 관심종목 관련 검증 (필요시에만 사용)
 */
export const validateAddWatchlistRequest = validateRequestBody(AddWatchlistItemSchema);
export const validateWatchlistStatusRequest = validateRequestBody(WatchlistStatusSchema);
export const validateSymbolParam = validateUrlParams(
  z.object({
    symbol: z
      .string()
      .min(1)
      .max(10)
      .transform((val) => val.toUpperCase().trim()),
  }),
);

/**
 * 응답 데이터 검증
 */
export function validateApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): {
  isValid: boolean;
  validatedData: T | null;
  error?: string;
} {
  try {
    const validatedData = schema.parse(data);
    return {
      isValid: true,
      validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        validatedData: null,
        error: `Response validation failed: ${error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    return {
      isValid: false,
      validatedData: null,
      error: 'Unknown validation error',
    };
  }
}

/**
 * 에러 응답 검증
 */
export function validateErrorResponse(data: unknown): boolean {
  try {
    ApiErrorSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

