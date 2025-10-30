import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';

/**
 * API 라우트용 인증 미들웨어
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  user: { id: string; email: string } | null;
  error?: NextResponse;
}> {
  try {
    // Better Auth를 사용하여 세션 확인
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return {
        user: null,
        error: NextResponse.json(
          {
            success: false,
            error: 'Authentication required',
            code: 'UNAUTHORIZED',
          },
          { status: 401 },
        ),
      };
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      user: null,
      error: NextResponse.json(
        {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_ERROR',
        },
        { status: 401 },
      ),
    };
  }
}

/**
 * 인증이 필요한 API 핸들러 래퍼
 */
export function withAuth(
  handler: (request: NextRequest, user: { id: string; email: string }) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return (
        error ||
        NextResponse.json(
          {
            success: false,
            error: 'Authentication required',
            code: 'UNAUTHORIZED',
          },
          { status: 401 },
        )
      );
    }

    return handler(request, user);
  };
}

/**
 * 사용자 ID 추출 헬퍼
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return session?.user?.id || null;
  } catch {
    return null;
  }
}
