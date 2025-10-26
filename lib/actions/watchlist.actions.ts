'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';
import { WATCHLIST_CONSTANTS } from '@/lib/constants';

/**
 * 사용자의 관심종목 목록을 조회합니다.
 *
 * @param userId - 사용자 ID
 * @returns 관심종목 목록
 */
export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  if (!userId) return [];

  return unstable_cache(
    async () => {
      try {
        await connectToDatabase();
        const items = await Watchlist.find({ userId }).sort({ addedAt: -1 });
        return items.map((item) => ({
          _id: String(item._id),
          userId: item.userId,
          symbol: item.symbol,
          company: item.company,
          addedAt: item.addedAt,
          createdAt: item.addedAt,
          updatedAt: item.addedAt,
        }));
      } catch (error) {
        console.error('getWatchlist error:', error);
        return [];
      }
    },
    [`watchlist-${userId}`],
    {
      tags: ['watchlist', `watchlist-${userId}`],
    },
  )();
}

/**
 * 관심종목에 주식을 추가합니다.
 *
 * @param userId - 사용자 ID
 * @param symbol - 주식 심볼
 * @param company - 회사명
 * @returns 추가된 관심종목 항목
 */
export async function addToWatchlist(userId: string, symbol: string, company: string): Promise<WatchlistItem> {
  if (!userId || !symbol || !company) {
    throw new Error('Missing required parameters');
  }

  try {
    await connectToDatabase();

    // 사용자별 관심종목 개수 확인
    const currentCount = await Watchlist.countDocuments({ userId });
    if (currentCount >= 50) {
      throw new Error('Watchlist limit reached (50 stocks)');
    }

    // 중복 확인
    const existingItem = await Watchlist.findOne({ userId, symbol });
    if (existingItem) {
      throw new Error('Stock already in watchlist');
    }

    const watchlistData: CreateWatchlistItemData = {
      userId,
      symbol: symbol.toUpperCase().trim(),
      company: company.trim(),
    };

    const newItem = await Watchlist.create(watchlistData);

    // 캐시 무효화
    revalidateTag('watchlist');
    revalidateTag(`watchlist-${userId}`);
    revalidateTag(`watchlist-${symbol.toUpperCase()}`);

    return {
      _id: String(newItem._id),
      userId: newItem.userId,
      symbol: newItem.symbol,
      company: newItem.company,
      addedAt: newItem.addedAt,
      createdAt: newItem.addedAt,
      updatedAt: newItem.addedAt,
    };
  } catch (error) {
    console.error('addToWatchlist error:', error);
    throw error;
  }
}

/**
 * 관심종목에서 주식을 제거합니다.
 *
 * @param userId - 사용자 ID
 * @param symbol - 주식 심볼
 * @returns 제거 성공 여부
 */
export async function removeFromWatchlist(userId: string, symbol: string): Promise<boolean> {
  if (!userId || !symbol) {
    throw new Error('Missing required parameters');
  }

  try {
    await connectToDatabase();

    const result = await Watchlist.deleteOne({
      userId,
      symbol: symbol.toUpperCase().trim(),
    });

    // 캐시 무효화
    revalidateTag('watchlist');
    revalidateTag(`watchlist-${userId}`);
    revalidateTag(`watchlist-${symbol.toUpperCase()}`);

    return result.deletedCount > 0;
  } catch (error) {
    console.error('removeFromWatchlist error:', error);
    throw error;
  }
}

/**
 * 특정 주식이 관심종목에 포함되어 있는지 확인합니다.
 *
 * @param userId - 사용자 ID
 * @param symbol - 주식 심볼
 * @returns 관심종목 포함 여부
 */
export async function checkWatchlistStatus(userId: string, symbol: string): Promise<boolean> {
  if (!userId || !symbol) return false;

  return unstable_cache(
    async () => {
      try {
        await connectToDatabase();

        const item = await Watchlist.findOne({
          userId,
          symbol: symbol.toUpperCase().trim(),
        });

        return !!item;
      } catch (error) {
        console.error('checkWatchlistStatus error:', error);
        return false;
      }
    },
    [`watchlist-status-${userId}-${symbol.toUpperCase()}`],
    {
      tags: ['watchlist', `watchlist-${userId}`, `watchlist-${symbol.toUpperCase()}`],
    },
  )();
}

/**
 * 사용자 이메일과 연관된 관심목록 심볼을 조회합니다.
 *
 * @param email - 조회할 사용자의 이메일 주소
 * @returns 지정된 사용자의 관심목록 심볼 문자열 배열. 이메일이 없거나, 사용자를 찾을 수 없거나, 오류가 발생한 경우 빈 배열을 반환합니다.
 */
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function getWatchlistCount(userId: string): Promise<number> {
  try {
    await connectToDatabase();
    return await Watchlist.countDocuments({ userId });
  } catch (error) {
    console.error('Error getting watchlist count:', error);
    return 0;
  }
}

/**
 * 관심종목 제한 확인
 */
export async function checkWatchlistLimit(userId: string): Promise<{
  canAdd: boolean;
  current: number;
  limit: number;
}> {
  const current = await getWatchlistCount(userId);
  const limit = WATCHLIST_CONSTANTS.MAX_ITEMS_PER_USER;

  return {
    canAdd: current < limit,
    current,
    limit,
  };
}
