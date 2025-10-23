import { z } from 'zod';

/**
 * 관심종목 항목 추가를 위한 스키마
 */
export const AddWatchlistItemSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol too long')
    .transform(val => val.toUpperCase().trim()),
  company: z.string()
    .min(1, 'Company name is required')
    .max(100, 'Company name too long')
    .transform(val => val.trim())
});

/**
 * 관심종목 상태 확인을 위한 스키마
 */
export const WatchlistStatusSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol too long')
    .transform(val => val.toUpperCase().trim())
});

/**
 * 관심종목 항목 스키마 (응답용)
 */
export const WatchlistItemSchema = z.object({
  symbol: z.string(),
  company: z.string(),
  addedAt: z.string()
});

/**
 * 관심종목 목록 응답 스키마
 */
export const WatchlistResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    watchlist: z.array(WatchlistItemSchema),
    count: z.number()
  })
});

/**
 * 관심종목 추가 응답 스키마
 */
export const AddWatchlistResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    message: z.string(),
    watchlistItem: WatchlistItemSchema
  })
});

/**
 * 관심종목 제거 응답 스키마
 */
export const RemoveWatchlistResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    message: z.string(),
    symbol: z.string()
  })
});

/**
 * 관심종목 상태 응답 스키마
 */
export const WatchlistStatusResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    isInWatchlist: z.boolean(),
    symbol: z.string()
  })
});

/**
 * API 오류 응답 스키마
 */
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional()
});

/**
 * 타입 추출
 */
export type AddWatchlistItem = z.infer<typeof AddWatchlistItemSchema>;
export type WatchlistStatus = z.infer<typeof WatchlistStatusSchema>;
export type WatchlistItem = z.infer<typeof WatchlistItemSchema>;
export type WatchlistResponse = z.infer<typeof WatchlistResponseSchema>;
export type AddWatchlistResponse = z.infer<typeof AddWatchlistResponseSchema>;
export type RemoveWatchlistResponse = z.infer<typeof RemoveWatchlistResponseSchema>;
export type WatchlistStatusResponse = z.infer<typeof WatchlistStatusResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
