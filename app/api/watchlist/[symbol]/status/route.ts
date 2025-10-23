import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { checkWatchlistStatus } from '@/lib/actions/watchlist.actions';

/**
 * GET /api/watchlist/[symbol]/status
 * 특정 주식이 관심종목에 포함되어 있는지 확인합니다.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    // 인증 확인
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 심볼 검증
    const symbol = params.symbol.toUpperCase().trim();
    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Invalid symbol' },
        { status: 400 }
      );
    }

    // 관심종목 상태 확인
    const isInWatchlist = await checkWatchlistStatus(session.user.id, symbol);

    return NextResponse.json({
      success: true,
      data: {
        isInWatchlist,
        symbol
      }
    });

  } catch (error) {
    console.error('Failed to check watchlist status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check watchlist status' },
      { status: 500 }
    );
  }
}
