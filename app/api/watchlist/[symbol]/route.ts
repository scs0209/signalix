import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { AddWatchlistItemSchema } from '@/lib/schemas/watchlist';

/**
 * POST /api/watchlist/[symbol]
 * 특정 주식을 관심종목에 추가합니다.
 */
export async function POST(
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

    // 요청 본문 파싱 및 검증
    const body = await request.json();
    const validatedData = AddWatchlistItemSchema.parse({
      symbol: params.symbol,
      company: body.company
    });

    // 관심종목 추가
    const watchlistItem = await addToWatchlist(
      session.user.id,
      validatedData.symbol,
      validatedData.company
    );

    return NextResponse.json({
      success: true,
      data: {
        message: 'Stock added to watchlist',
        watchlistItem: {
          symbol: watchlistItem.symbol,
          company: watchlistItem.company,
          addedAt: watchlistItem.addedAt.toISOString()
        }
      }
    });

  } catch (error: unknown) {
    console.error('Failed to add stock to watchlist:', error);

    // Zod 검증 오류
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid symbol or company name' },
        { status: 400 }
      );
    }

    // 중복 오류
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Stock already in watchlist' },
        { status: 409 }
      );
    }

    // 제한 초과 오류
    if (error instanceof Error && error.message?.includes('limit')) {
      return NextResponse.json(
        { success: false, error: 'Watchlist limit reached (50 stocks)' },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to add stock to watchlist' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/watchlist/[symbol]
 * 특정 주식을 관심종목에서 제거합니다.
 */
export async function DELETE(
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

    // 관심종목 제거
    const result = await removeFromWatchlist(session.user.id, symbol);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Stock not found in watchlist' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Stock removed from watchlist',
        symbol
      }
    });

  } catch (error) {
    console.error('Failed to remove stock from watchlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove stock from watchlist' },
      { status: 500 }
    );
  }
}
