import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '../models/watchlist.model';
import { setupWatchlistIndexes } from './setup-indexes';

/**
 * 관심종목 스키마 마이그레이션
 */

export async function migrateWatchlistSchema(): Promise<void> {
  try {
    console.log('Starting watchlist schema migration...');

    await connectToDatabase();

    // 인덱스 설정
    await setupWatchlistIndexes();

    console.log('Watchlist schema migration completed successfully');
  } catch (error) {
    console.error('Watchlist schema migration failed:', error);
    throw error;
  }
}

/**
 * 마이그레이션 롤백
 */
export async function rollbackWatchlistSchema(): Promise<void> {
  try {
    console.log('Rolling back watchlist schema migration...');

    await connectToDatabase();

    // 인덱스 제거 (필요시)
    // await Watchlist.collection.dropIndexes();

    console.log('Watchlist schema rollback completed');
  } catch (error) {
    console.error('Watchlist schema rollback failed:', error);
    throw error;
  }
}

/**
 * 마이그레이션 상태 확인
 */
export async function checkMigrationStatus(): Promise<void> {
  try {
    await connectToDatabase();

    const indexes = await Watchlist.collection.listIndexes().toArray();
    const requiredIndexes = ['userId_symbol_unique', 'userId_lookup', 'userId_addedAt_desc', 'symbol_lookup'];

    const existingIndexNames = indexes.map((idx) => idx.name);
    const missingIndexes = requiredIndexes.filter((name) => !existingIndexNames.includes(name));

    if (missingIndexes.length === 0) {
      console.log('✅ All required indexes are present');
    } else {
      console.log('❌ Missing indexes:', missingIndexes);
    }
  } catch (error) {
    console.error('Error checking migration status:', error);
    throw error;
  }
}
