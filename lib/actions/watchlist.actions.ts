'use server';

import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';

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

    // Better Auth stores users in the "user" collection
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
