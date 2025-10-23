import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getWatchlist } from '@/lib/actions/watchlist.actions';
import { auth } from '@/lib/better-auth/auth';

/**
 * GET /api/watchlist
 * 현재 사용자의 관심종목 목록을 조회합니다.
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    // 관심종목 목록 조회
    const watchlist = await getWatchlist(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        watchlist: watchlist.map((item) => ({
          symbol: item.symbol,
          company: item.company,
          addedAt: item.addedAt.toISOString(),
        })),
        count: watchlist.length,
      },
    });
  } catch (error) {
    console.error('Failed to fetch watchlist:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}
