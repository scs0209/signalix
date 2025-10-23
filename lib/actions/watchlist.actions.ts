'use server';

import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';
import type { WatchlistItem, CreateWatchlistItemData } from '@/types/watchlist';

/**
 * 사용자의 관심종목 목록을 조회합니다.
 *
 * @param userId - 사용자 ID
 * @returns 관심종목 목록
 */
export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  if (!userId) return [];

  try {
    await connectToDatabase();
    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
    return items.map(item => ({
      _id: item._id.toString(),
      userId: item.userId,
      symbol: item.symbol,
      company: item.company,
      addedAt: item.addedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  } catch (error) {
    console.error('getWatchlist error:', error);
    return [];
  }
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
      company: company.trim()
    };

    const newItem = await Watchlist.create(watchlistData);
    
    return {
      _id: newItem._id.toString(),
      userId: newItem.userId,
      symbol: newItem.symbol,
      company: newItem.company,
      addedAt: newItem.addedAt,
      createdAt: newItem.createdAt,
      updatedAt: newItem.updatedAt
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
      symbol: symbol.toUpperCase().trim() 
    });
    
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

  try {
    await connectToDatabase();
    
    const item = await Watchlist.findOne({ 
      userId, 
      symbol: symbol.toUpperCase().trim() 
    });
    
    return !!item;
  } catch (error) {
    console.error('checkWatchlistStatus error:', error);
    return false;
  }
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
