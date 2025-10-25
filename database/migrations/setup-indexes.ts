import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';

/**
 * 데이터베이스 인덱스 설정 및 최적화
 *
 * 이 파일은 관심종목 컬렉션의 성능 최적화를 위한 인덱스를 관리합니다.
 * 사용 위치: 데이터베이스 마이그레이션, 초기 설정, 성능 튜닝
 */

/**
 * 관심종목 컬렉션에 필요한 인덱스들을 생성합니다.
 *
 * @description 이 함수는 다음 인덱스들을 생성합니다:
 * - userId + symbol 복합 인덱스 (유니크 제약, 중복 방지)
 * - userId 단일 인덱스 (사용자별 관심종목 조회 최적화)
 * - userId + addedAt 복합 인덱스 (날짜순 정렬 최적화)
 * - symbol 인덱스 (관리자 기능용 심볼별 조회)
 *
 * @example
 * ```typescript
 * // 데이터베이스 마이그레이션에서 사용
 * await setupWatchlistIndexes();
 *
 * // 초기 설정 스크립트에서 사용
 * import { setupWatchlistIndexes } from './setup-indexes';
 * await setupWatchlistIndexes();
 * ```
 *
 * @throws {Error} 데이터베이스 연결 실패 또는 인덱스 생성 실패 시
 * @returns {Promise<void>} 인덱스 생성 완료
 *
 * @usedIn
 * - database/migrations/watchlist-migration.ts
 * - scripts/setup-database.ts
 * - package.json의 setup-db 스크립트
 */
export async function setupWatchlistIndexes(): Promise<void> {
  try {
    await connectToDatabase();

    console.log('Setting up watchlist indexes...');

    // 복합 인덱스 (유니크) - userId + symbol
    await Watchlist.collection.createIndex(
      { userId: 1, symbol: 1 },
      {
        unique: true,
        name: 'userId_symbol_unique',
        background: true,
      },
    );

    // 사용자별 조회 최적화 인덱스
    await Watchlist.collection.createIndex(
      { userId: 1 },
      {
        name: 'userId_lookup',
        background: true,
      },
    );

    // 추가일시 정렬을 위한 인덱스
    await Watchlist.collection.createIndex(
      { userId: 1, addedAt: -1 },
      {
        name: 'userId_addedAt_desc',
        background: true,
      },
    );

    // 심볼별 조회를 위한 인덱스 (관리자 기능용)
    await Watchlist.collection.createIndex(
      { symbol: 1 },
      {
        name: 'symbol_lookup',
        background: true,
      },
    );

    console.log('Watchlist indexes setup completed successfully');
  } catch (error) {
    console.error('Error setting up watchlist indexes:', error);
    throw error;
  }
}

/**
 * 현재 생성된 인덱스 목록을 확인합니다.
 *
 * @description 데이터베이스에 생성된 모든 인덱스의 이름과 키 정보를 출력합니다.
 * 인덱스가 올바르게 생성되었는지 확인하거나 디버깅 시 사용합니다.
 *
 * @example
 * ```typescript
 * // 인덱스 상태 확인
 * await checkWatchlistIndexes();
 *
 * // 마이그레이션 후 검증
 * await setupWatchlistIndexes();
 * await checkWatchlistIndexes();
 * ```
 *
 * @throws {Error} 데이터베이스 연결 실패 또는 인덱스 조회 실패 시
 * @returns {Promise<void>} 인덱스 목록 출력 완료
 *
 * @usedIn
 * - database/migrations/watchlist-migration.ts (마이그레이션 검증)
 * - scripts/verify-database.ts (데이터베이스 검증)
 * - 개발자 도구 및 디버깅
 */
export async function checkWatchlistIndexes(): Promise<void> {
  try {
    await connectToDatabase();

    const indexes = await Watchlist.collection.listIndexes().toArray();

    console.log('Current watchlist indexes:');
    indexes.forEach((index) => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
  } catch (error) {
    console.error('Error checking watchlist indexes:', error);
    throw error;
  }
}

/**
 * 관심종목 컬렉션의 성능 통계 정보를 조회합니다.
 *
 * @description MongoDB의 collStats 명령을 사용하여 컬렉션의 상세 통계를 가져옵니다.
 * 성능 모니터링, 용량 관리, 인덱스 효율성 분석에 사용됩니다.
 *
 * @example
 * ```typescript
 * // 성능 모니터링
 * await getWatchlistIndexStats();
 *
 * // 정기적인 데이터베이스 상태 확인
 * setInterval(async () => {
 *   await getWatchlistIndexStats();
 * }, 60000); // 1분마다
 * ```
 *
 * @throws {Error} 데이터베이스 연결 실패 또는 통계 조회 실패 시
 * @returns {Promise<void>} 통계 정보 출력 완료
 *
 * @usedIn
 * - scripts/monitor-database.ts (성능 모니터링)
 * - admin/dashboard.ts (관리자 대시보드)
 * - database/migrations/watchlist-migration.ts (마이그레이션 후 검증)
 * - 성능 튜닝 및 최적화 작업
 */
export async function getWatchlistIndexStats(): Promise<void> {
  try {
    await connectToDatabase();

    const stats = await Watchlist.collection.db.command({ collStats: Watchlist.collection.collectionName });

    console.log('Watchlist collection stats:');
    console.log(`- Document count: ${stats.count}`);
    console.log(`- Average document size: ${stats.avgObjSize} bytes`);
    console.log(`- Total size: ${stats.size} bytes`);
    console.log(`- Index count: ${stats.nindexes}`);
    console.log(`- Total index size: ${stats.totalIndexSize} bytes`);
  } catch (error) {
    console.error('Error getting watchlist index stats:', error);
    throw error;
  }
}
