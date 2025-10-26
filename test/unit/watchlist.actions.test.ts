import mongoose from 'mongoose';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Watchlist 비즈니스 로직 단위 테스트
 */

// Mock MongoDB 연결 - import 전에 선언
vi.mock('@/database/mongoose', () => ({
  connectToDatabase: vi.fn(),
}));

// Mock Watchlist 모델 - import 전에 선언
vi.mock('@/database/models/watchlist.model', () => ({
  Watchlist: {
    find: vi.fn(),
    findOne: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    deleteOne: vi.fn(),
    insertMany: vi.fn(),
  },
}));

// mock 선언 후 import
import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';
import {
  addToWatchlist,
  checkWatchlistLimit,
  checkWatchlistStatus,
  getWatchlist,
  getWatchlistCount,
  removeFromWatchlist,
} from '@/lib/actions/watchlist.actions';

describe('Watchlist Actions', () => {
  const mockUserId = 'test-user-123';
  const mockSymbol = 'AAPL';
  const mockCompany = 'Apple Inc.';

  const mockWatchlistItem = {
    _id: 'mock-id-123',
    userId: mockUserId,
    symbol: mockSymbol,
    company: mockCompany,
    addedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    save: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectToDatabase).mockResolvedValue(mongoose);
    // console.error를 mock하여 테스트 중 에러 로그 숨기기
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getWatchlist', () => {
    it('사용자의 관심종목 목록을 성공적으로 조회해야 함', async () => {
      const mockItems = [mockWatchlistItem];
      vi.mocked(Watchlist.find).mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockItems),
      } as any);

      const result = await getWatchlist(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        _id: mockWatchlistItem._id,
        userId: mockWatchlistItem.userId,
        symbol: mockWatchlistItem.symbol,
        company: mockWatchlistItem.company,
        addedAt: mockWatchlistItem.addedAt,
        createdAt: mockWatchlistItem.createdAt,
        updatedAt: mockWatchlistItem.updatedAt,
      });
    });

    it('빈 관심종목 목록을 올바르게 처리해야 함', async () => {
      vi.mocked(Watchlist.find).mockReturnValue({
        sort: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await getWatchlist(mockUserId);

      expect(result).toEqual([]);
    });

    it('데이터베이스 오류 시 빈 배열을 반환해야 함', async () => {
      vi.mocked(Watchlist.find).mockReturnValue({
        sort: vi.fn().mockRejectedValue(new Error('Database error')),
      } as any);

      const result = await getWatchlist(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('addToWatchlist', () => {
    it('관심종목을 성공적으로 추가해야 함', async () => {
      vi.mocked(Watchlist.countDocuments).mockResolvedValue(5);
      vi.mocked(Watchlist.findOne).mockResolvedValue(null);
      vi.mocked(Watchlist.create).mockResolvedValue(mockWatchlistItem as any);

      const result = await addToWatchlist(mockUserId, mockSymbol, mockCompany);

      expect(result._id).toBe(mockWatchlistItem._id);
      expect(result.userId).toBe(mockWatchlistItem.userId);
      expect(result.symbol).toBe(mockWatchlistItem.symbol);
      expect(result.company).toBe(mockWatchlistItem.company);
    });

    it('최대 개수 초과 시 오류를 던져야 함', async () => {
      vi.mocked(Watchlist.countDocuments).mockResolvedValue(50);

      await expect(addToWatchlist(mockUserId, mockSymbol, mockCompany)).rejects.toThrow(
        'Watchlist limit reached (50 stocks)',
      );
      // create는 호출되지 않아야 함
      expect(Watchlist.create).not.toHaveBeenCalled();
    });

    it('중복 심볼 추가 시 오류를 던져야 함', async () => {
      vi.mocked(Watchlist.countDocuments).mockResolvedValue(5);
      vi.mocked(Watchlist.findOne).mockResolvedValue(mockWatchlistItem);

      await expect(addToWatchlist(mockUserId, mockSymbol, mockCompany)).rejects.toThrow('Stock already in watchlist');
    });

    it('심볼을 대문자로 변환해야 함', async () => {
      vi.mocked(Watchlist.countDocuments).mockResolvedValue(5);
      vi.mocked(Watchlist.findOne).mockResolvedValue(null);
      vi.mocked(Watchlist.create).mockResolvedValue(mockWatchlistItem as any);

      await addToWatchlist(mockUserId, 'aapl', mockCompany);

      // findOne은 원본 심볼로 호출됨 (중복 체크용)
      expect(Watchlist.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        symbol: 'aapl',
      });

      // create는 대문자로 변환된 심볼로 호출됨
      expect(Watchlist.create).toHaveBeenCalledWith({
        userId: mockUserId,
        symbol: 'AAPL',
        company: mockCompany.trim(),
      });
    });
  });

  describe('removeFromWatchlist', () => {
    it('관심종목을 성공적으로 제거해야 함', async () => {
      vi.mocked(Watchlist.deleteOne).mockResolvedValue({ deletedCount: 1 } as any);

      const result = await removeFromWatchlist(mockUserId, mockSymbol);

      expect(result).toBe(true);
    });

    it('존재하지 않는 항목 제거 시 false를 반환해야 함', async () => {
      vi.mocked(Watchlist.deleteOne).mockResolvedValue({ deletedCount: 0 } as any);

      const result = await removeFromWatchlist(mockUserId, mockSymbol);

      expect(result).toBe(false);
    });

    it('심볼을 대문자로 변환해야 함', async () => {
      vi.mocked(Watchlist.deleteOne).mockResolvedValue({ deletedCount: 1 } as any);

      await removeFromWatchlist(mockUserId, 'aapl');

      expect(Watchlist.deleteOne).toHaveBeenCalledWith({
        userId: mockUserId,
        symbol: 'AAPL',
      });
    });
  });

  describe('checkWatchlistStatus', () => {
    it('관심종목에 있는 경우 true를 반환해야 함', async () => {
      vi.mocked(Watchlist.findOne).mockResolvedValue(mockWatchlistItem);

      const result = await checkWatchlistStatus(mockUserId, mockSymbol);

      expect(result).toBe(true);
    });

    it('관심종목에 없는 경우 false를 반환해야 함', async () => {
      vi.mocked(Watchlist.findOne).mockResolvedValue(null);

      const result = await checkWatchlistStatus(mockUserId, mockSymbol);

      expect(result).toBe(false);
    });

    it('심볼을 대문자로 변환해야 함', async () => {
      vi.mocked(Watchlist.findOne).mockResolvedValue(null);

      await checkWatchlistStatus(mockUserId, 'aapl');

      expect(Watchlist.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        symbol: 'AAPL',
      });
    });
  });

  describe('getWatchlistCount', () => {
    it('올바른 개수를 반환해야 함', async () => {
      vi.mocked(Watchlist.countDocuments).mockResolvedValue(5);

      const count = await getWatchlistCount(mockUserId);

      expect(count).toBe(5);
      expect(Watchlist.countDocuments).toHaveBeenCalledWith({ userId: mockUserId });
    });

    it('오류 시 0을 반환해야 함', async () => {
      vi.mocked(Watchlist.countDocuments).mockRejectedValue(new Error('Database error'));

      const count = await getWatchlistCount(mockUserId);

      expect(count).toBe(0);
    });
  });

  describe('checkWatchlistLimit', () => {
    it('제한 내에서 추가 가능한 경우 올바른 결과를 반환해야 함', async () => {
      vi.mocked(Watchlist.countDocuments).mockResolvedValue(30);

      const result = await checkWatchlistLimit(mockUserId);

      expect(result.canAdd).toBe(true);
      expect(result.current).toBe(30);
      expect(result.limit).toBe(50);
    });

    it('제한에 도달한 경우 추가 불가능한 결과를 반환해야 함', async () => {
      vi.mocked(Watchlist.countDocuments).mockResolvedValue(50);

      const result = await checkWatchlistLimit(mockUserId);

      expect(result.canAdd).toBe(false);
      expect(result.current).toBe(50);
      expect(result.limit).toBe(50);
    });
  });

  describe('에러 처리', () => {
    it('데이터베이스 연결 오류를 올바르게 처리해야 함', async () => {
      vi.mocked(connectToDatabase).mockRejectedValue(new Error('Connection failed'));

      const result = await getWatchlist(mockUserId);

      expect(result).toEqual([]);
    });

    it('예상치 못한 오류를 올바르게 처리해야 함', async () => {
      vi.mocked(Watchlist.find).mockReturnValue({
        sort: vi.fn().mockRejectedValue('Unexpected error'),
      } as any);

      const result = await getWatchlist(mockUserId);

      expect(result).toEqual([]);
    });
  });
});
