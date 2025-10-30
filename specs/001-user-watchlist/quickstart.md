# Quickstart Guide: User Watchlist Management

**Feature**: User Watchlist Management  
**Date**: 2025-10-22  
**Status**: Complete

## Overview

사용자별 개인 관심종목 관리 기능을 구현하는 가이드입니다. 인증된 사용자가 주식 상세 페이지에서 관심종목을 추가/제거할 수 있으며, 상태를 실시간으로 확인할 수 있습니다.

## Prerequisites

- Next.js 15+ 프로젝트
- MongoDB 데이터베이스
- Better Auth 인증 시스템
- 기존 WatchlistButton 컴포넌트

## Implementation Steps

### 1. API 엔드포인트 구현

#### 관심종목 조회 API
```typescript
// app/api/watchlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { getWatchlistByUserId } from '@/lib/actions/watchlist.actions';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const watchlist = await getWatchlistByUserId(session.user.id);
    
    return NextResponse.json({
      success: true,
      data: {
        watchlist,
        count: watchlist.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}
```

#### 관심종목 추가/제거 API
```typescript
// app/api/watchlist/[symbol]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { AddWatchlistItemSchema } from '@/lib/schemas/watchlist';

export async function POST(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = AddWatchlistItemSchema.parse({
      symbol: params.symbol,
      company: body.company
    });

    const result = await addToWatchlist(session.user.id, validatedData);
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Stock added to watchlist',
        watchlistItem: result
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to add stock to watchlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await removeFromWatchlist(session.user.id, params.symbol);
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Stock removed from watchlist',
        symbol: params.symbol
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to remove stock from watchlist' },
      { status: 500 }
    );
  }
}
```

### 2. 비즈니스 로직 구현

#### Watchlist Actions
```typescript
// lib/actions/watchlist.actions.ts
'use server';

import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';
import { AddWatchlistItemSchema } from '@/lib/schemas/watchlist';

export async function getWatchlistByUserId(userId: string) {
  await connectToDatabase();
  
  const items = await Watchlist.find({ userId })
    .select('symbol company addedAt')
    .sort({ addedAt: -1 });
    
  return items.map(item => ({
    symbol: item.symbol,
    company: item.company,
    addedAt: item.addedAt.toISOString()
  }));
}

export async function addToWatchlist(userId: string, data: z.infer<typeof AddWatchlistItemSchema>) {
  await connectToDatabase();
  
  // 중복 확인
  const existing = await Watchlist.findOne({ userId, symbol: data.symbol });
  if (existing) {
    throw new Error('Stock already in watchlist');
  }
  
  // 개수 제한 확인
  const count = await Watchlist.countDocuments({ userId });
  if (count >= 50) {
    throw new Error('Watchlist limit reached');
  }
  
  const item = new Watchlist({
    userId,
    symbol: data.symbol,
    company: data.company,
    addedAt: new Date()
  });
  
  await item.save();
  
  return {
    symbol: item.symbol,
    company: item.company,
    addedAt: item.addedAt.toISOString()
  };
}

export async function removeFromWatchlist(userId: string, symbol: string) {
  await connectToDatabase();
  
  const result = await Watchlist.deleteOne({ userId, symbol });
  if (result.deletedCount === 0) {
    throw new Error('Stock not found in watchlist');
  }
}

export async function checkWatchlistStatus(userId: string, symbol: string) {
  await connectToDatabase();
  
  const item = await Watchlist.findOne({ userId, symbol });
  return !!item;
}
```

### 3. Zod 스키마 정의

```typescript
// lib/schemas/watchlist.ts
import { z } from 'zod';

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

export const WatchlistStatusSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol too long')
    .transform(val => val.toUpperCase().trim())
});
```

### 4. WatchlistButton 컴포넌트 업데이트

```typescript
// components/WatchlistButton.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist, checkWatchlistStatus } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  userId?: string;
  type?: 'button' | 'icon';
}

export default function WatchlistButton({ 
  symbol, 
  company, 
  userId, 
  type = 'button' 
}: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!userId);

  useEffect(() => {
    if (userId) {
      checkWatchlistStatus(userId, symbol).then(setIsInWatchlist);
    }
  }, [userId, symbol]);

  const handleToggle = async () => {
    if (!userId) {
      toast.error('Please log in to manage your watchlist');
      return;
    }

    setLoading(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(userId, symbol);
        setIsInWatchlist(false);
        toast.success(`${symbol} removed from watchlist`);
      } else {
        await addToWatchlist(userId, { symbol, company });
        setIsInWatchlist(true);
        toast.success(`${symbol} added to watchlist`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        disabled
        title="Please log in to manage your watchlist"
        className="opacity-50 cursor-not-allowed"
      >
        {type === 'icon' ? '⭐' : 'Add to Watchlist'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`
        ${type === 'icon' ? 'watchlist-icon-btn' : 'watchlist-btn'}
        ${isInWatchlist ? 'watchlist-added' : ''}
        ${loading ? 'opacity-50' : ''}
      `}
    >
      {type === 'icon' ? (
        <svg viewBox="0 0 24 24" fill={isInWatchlist ? '#FACC15' : 'none'}>
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z" />
        </svg>
      ) : (
        isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'
      )}
    </button>
  );
}
```

### 5. 페이지에서 사용

```typescript
// app/(main)/stocks/[symbol]/page.tsx
import WatchlistButton from '@/components/WatchlistButton';
import { auth } from '@/lib/better-auth/auth';

export default async function StockDetailsPage({ 
  params 
}: { 
  params: Promise<{ symbol: string }> 
}) {
  const { symbol } = await params;
  const session = await auth();

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* 기존 TradingView 위젯들 */}
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <WatchlistButton 
              symbol={symbol.toUpperCase()} 
              company={symbol.toUpperCase()}
              userId={session?.user?.id}
            />
          </div>
          
          {/* 기존 위젯들 */}
        </div>
      </section>
    </div>
  );
}
```

## Testing

### 단위 테스트
```typescript
// test/unit/WatchlistButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import WatchlistButton from '@/components/WatchlistButton';

describe('WatchlistButton', () => {
  it('shows login prompt for unauthenticated users', () => {
    render(<WatchlistButton symbol="AAPL" company="Apple Inc." />);
    expect(screen.getByText('Add to Watchlist')).toBeDisabled();
  });

  it('toggles watchlist status for authenticated users', async () => {
    render(
      <WatchlistButton 
        symbol="AAPL" 
        company="Apple Inc." 
        userId="user123" 
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // 테스트 구현...
  });
});
```

### 통합 테스트
```typescript
// test/integration/watchlist-api.test.ts
import { testApi } from '@/lib/test-utils';

describe('Watchlist API', () => {
  it('adds stock to watchlist', async () => {
    const response = await testApi.post('/api/watchlist/AAPL', {
      company: 'Apple Inc.'
    });
    
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });
});
```

## Deployment Checklist

- [ ] MongoDB 연결 확인
- [ ] Better Auth 설정 확인
- [ ] 환경 변수 설정
- [ ] API 엔드포인트 테스트
- [ ] 컴포넌트 렌더링 테스트
- [ ] 인증 플로우 테스트
- [ ] 오류 처리 테스트
- [ ] 성능 테스트

## Troubleshooting

### 일반적인 문제
1. **인증 오류**: Better Auth 세션 확인
2. **데이터베이스 연결**: MongoDB 연결 상태 확인
3. **타입 오류**: Zod 스키마 검증 확인
4. **성능 문제**: 데이터베이스 인덱스 확인

### 로그 확인
```bash
# 개발 환경에서 로그 확인
npm run dev

# 프로덕션 환경에서 로그 확인
pm2 logs signalix
```
