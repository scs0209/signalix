/**
 * 관심종목 관련 타입 정의
 */

/**
 * 관심종목 항목 인터페이스
 */
export interface WatchlistItem {
  _id: string;
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 관심종목 항목 생성 데이터
 */
export interface CreateWatchlistItemData {
  userId: string;
  symbol: string;
  company: string;
}

/**
 * 관심종목 항목 조회 필터
 */
export interface WatchlistFilter {
  userId: string;
  symbol?: string;
}

/**
 * 관심종목 비즈니스 로직 결과
 */
export interface WatchlistResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * 관심종목 추가 결과
 */
export interface AddWatchlistResult extends WatchlistResult {
  data?: {
    watchlistItem: WatchlistItem;
  };
}

/**
 * 관심종목 제거 결과
 */
export interface RemoveWatchlistResult extends WatchlistResult {
  data?: {
    symbol: string;
  };
}

/**
 * 관심종목 상태 확인 결과
 */
export interface WatchlistStatusResult extends WatchlistResult {
  data?: {
    isInWatchlist: boolean;
    symbol: string;
  };
}

/**
 * 관심종목 목록 조회 결과
 */
export interface GetWatchlistResult extends WatchlistResult {
  data?: {
    watchlist: WatchlistItem[];
    count: number;
  };
}

/**
 * 관심종목 제한 오류
 */
export interface WatchlistLimitError extends Error {
  code: 'WATCHLIST_LIMIT_EXCEEDED';
  limit: number;
  current: number;
}

/**
 * 관심종목 중복 오류
 */
export interface WatchlistDuplicateError extends Error {
  code: 'WATCHLIST_DUPLICATE';
  symbol: string;
  userId: string;
}

/**
 * 관심종목 관련 상수
 */
export const WATCHLIST_CONSTANTS = {
  MAX_ITEMS_PER_USER: 50,
  SYMBOL_MAX_LENGTH: 10,
  COMPANY_MAX_LENGTH: 100,
  CACHE_TTL_SECONDS: 300, // 5분
  STATUS_CACHE_TTL_SECONDS: 60, // 1분
} as const;

/**
 * 관심종목 작업 타입
 */
export type WatchlistAction = 'add' | 'remove' | 'check' | 'list';

/**
 * 관심종목 이벤트 타입
 */
export interface WatchlistEvent {
  action: WatchlistAction;
  userId: string;
  symbol?: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}
