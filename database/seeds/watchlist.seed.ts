import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';

/**
 * 관심종목 테스트 데이터 시드 스크립트
 *
 * 이 파일은 개발, 테스트, 데모 환경에서 사용할 관심종목 테스트 데이터를 관리합니다.
 * 실제 프로덕션 환경에서는 사용하지 않습니다.
 *
 * 주요 용도:
 * - 개발 환경에서 일관된 테스트 데이터 제공
 * - API 테스트 및 E2E 테스트용 데이터 준비
 * - 클라이언트 데모 및 프레젠테이션용 샘플 데이터
 * - 성능 테스트를 위한 대량 데이터 생성
 *
 * 포함된 데이터:
 * - 3명의 테스트 사용자 (test-user-1, test-user-2, test-user-3)
 * - 7개의 실제 주식 심볼 (AAPL, GOOGL, MSFT, TSLA, NVDA, AMZN, META)
 * - 각 사용자별로 다른 관심종목 구성
 *
 * 사용 방법:
 * ```bash
 * # 시드 데이터 삽입
 * pnpm run seed:watchlist
 *
 * # 테스트 데이터 정리
 * pnpm run clear:watchlist
 *
 * # 데이터 상태 확인
 * pnpm run check:watchlist
 * ```
 *
 * 주의사항:
 * - test-user- 접두사로 시작하는 데이터만 관리
 * - 프로덕션 데이터와 분리되어 안전하게 관리
 * - 테스트 후 반드시 정리 작업 수행 권장
 */

interface SeedWatchlistItem {
  userId: string;
  symbol: string;
  company: string;
  addedAt?: Date;
}

const SAMPLE_WATCHLIST_DATA: SeedWatchlistItem[] = [
  {
    userId: 'test-user-1',
    symbol: 'AAPL',
    company: 'Apple Inc.',
    addedAt: new Date('2024-01-15'),
  },
  {
    userId: 'test-user-1',
    symbol: 'GOOGL',
    company: 'Alphabet Inc.',
    addedAt: new Date('2024-01-16'),
  },
  {
    userId: 'test-user-1',
    symbol: 'MSFT',
    company: 'Microsoft Corporation',
    addedAt: new Date('2024-01-17'),
  },
  {
    userId: 'test-user-2',
    symbol: 'TSLA',
    company: 'Tesla, Inc.',
    addedAt: new Date('2024-01-18'),
  },
  {
    userId: 'test-user-2',
    symbol: 'NVDA',
    company: 'NVIDIA Corporation',
    addedAt: new Date('2024-01-19'),
  },
  {
    userId: 'test-user-3',
    symbol: 'AMZN',
    company: 'Amazon.com, Inc.',
    addedAt: new Date('2024-01-20'),
  },
  {
    userId: 'test-user-3',
    symbol: 'META',
    company: 'Meta Platforms, Inc.',
    addedAt: new Date('2024-01-21'),
  },
];

/**
 * 시드 데이터를 데이터베이스에 삽입합니다.
 */
export async function seedWatchlistData(): Promise<void> {
  try {
    console.log('Starting watchlist data seeding...');

    await connectToDatabase();

    // 기존 테스트 데이터 삭제
    await Watchlist.deleteMany({
      userId: { $regex: /^test-user-/ },
    });

    console.log('Cleared existing test data');

    // 새 시드 데이터 삽입
    const insertedItems = await Watchlist.insertMany(SAMPLE_WATCHLIST_DATA);

    console.log(`✅ Successfully seeded ${insertedItems.length} watchlist items`);

    // 삽입된 데이터 확인
    const user1Count = await Watchlist.countDocuments({ userId: 'test-user-1' });
    const user2Count = await Watchlist.countDocuments({ userId: 'test-user-2' });
    const user3Count = await Watchlist.countDocuments({ userId: 'test-user-3' });

    console.log(`User 1: ${user1Count} items`);
    console.log(`User 2: ${user2Count} items`);
    console.log(`User 3: ${user3Count} items`);
  } catch (error) {
    console.error('Error seeding watchlist data:', error);
    throw error;
  }
}

/**
 * 시드 데이터를 제거합니다.
 */
export async function clearWatchlistSeedData(): Promise<void> {
  try {
    console.log('Clearing watchlist seed data...');

    await connectToDatabase();

    const result = await Watchlist.deleteMany({
      userId: { $regex: /^test-user-/ },
    });

    console.log(`✅ Cleared ${result.deletedCount} test watchlist items`);
  } catch (error) {
    console.error('Error clearing watchlist seed data:', error);
    throw error;
  }
}

/**
 * 시드 데이터 상태를 확인합니다.
 */
export async function checkWatchlistSeedStatus(): Promise<void> {
  try {
    await connectToDatabase();

    const totalCount = await Watchlist.countDocuments();
    const testDataCount = await Watchlist.countDocuments({
      userId: { $regex: /^test-user-/ },
    });

    console.log(`Total watchlist items: ${totalCount}`);
    console.log(`Test data items: ${testDataCount}`);

    if (testDataCount > 0) {
      const users = await Watchlist.distinct('userId', {
        userId: { $regex: /^test-user-/ },
      });
      console.log(`Test users: ${users.join(', ')}`);
    }
  } catch (error) {
    console.error('Error checking watchlist seed status:', error);
    throw error;
  }
}

/**
 * 특정 사용자의 시드 데이터를 생성합니다.
 */
export async function createUserWatchlistSeed(userId: string, symbols: string[]): Promise<void> {
  try {
    await connectToDatabase();

    const watchlistItems = symbols.map((symbol) => ({
      userId,
      symbol: symbol.toUpperCase(),
      company: `${symbol.toUpperCase()} Company`, // 실제로는 외부 API에서 가져와야 함
      addedAt: new Date(),
    }));

    await Watchlist.insertMany(watchlistItems);

    console.log(`✅ Created watchlist for user ${userId} with ${symbols.length} items`);
  } catch (error) {
    console.error('Error creating user watchlist seed:', error);
    throw error;
  }
}
