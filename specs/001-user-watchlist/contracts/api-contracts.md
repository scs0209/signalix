# API Contracts: User Watchlist Management

**Feature**: User Watchlist Management  
**Date**: 2025-10-22  
**Status**: Complete

## API Endpoints

### 1. Get User Watchlist
**Endpoint**: `GET /api/watchlist`  
**Description**: 현재 사용자의 관심종목 목록을 조회한다.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response**:
```typescript
{
  success: true,
  data: {
    watchlist: Array<{
      symbol: string,
      company: string,
      addedAt: string // ISO date
    }>,
    count: number
  }
}
```

**Error Responses**:
```typescript
// 401 Unauthorized
{
  success: false,
  error: "Authentication required"
}

// 500 Internal Server Error
{
  success: false,
  error: "Failed to fetch watchlist"
}
```

### 2. Add Stock to Watchlist
**Endpoint**: `POST /api/watchlist/[symbol]`  
**Description**: 특정 주식을 관심종목에 추가한다.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```typescript
{
  symbol: string,
  company: string
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    message: "Stock added to watchlist",
    watchlistItem: {
      symbol: string,
      company: string,
      addedAt: string
    }
  }
}
```

**Error Responses**:
```typescript
// 400 Bad Request
{
  success: false,
  error: "Invalid symbol or company name"
}

// 401 Unauthorized
{
  success: false,
  error: "Authentication required"
}

// 409 Conflict
{
  success: false,
  error: "Stock already in watchlist"
}

// 413 Payload Too Large
{
  success: false,
  error: "Watchlist limit reached (50 stocks)"
}

// 500 Internal Server Error
{
  success: false,
  error: "Failed to add stock to watchlist"
}
```

### 3. Remove Stock from Watchlist
**Endpoint**: `DELETE /api/watchlist/[symbol]`  
**Description**: 특정 주식을 관심종목에서 제거한다.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response**:
```typescript
{
  success: true,
  data: {
    message: "Stock removed from watchlist",
    symbol: string
  }
}
```

**Error Responses**:
```typescript
// 401 Unauthorized
{
  success: false,
  error: "Authentication required"
}

// 404 Not Found
{
  success: false,
  error: "Stock not found in watchlist"
}

// 500 Internal Server Error
{
  success: false,
  error: "Failed to remove stock from watchlist"
}
```

### 4. Check Watchlist Status
**Endpoint**: `GET /api/watchlist/[symbol]/status`  
**Description**: 특정 주식이 관심종목에 포함되어 있는지 확인한다.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response**:
```typescript
{
  success: true,
  data: {
    isInWatchlist: boolean,
    symbol: string
  }
}
```

**Error Responses**:
```typescript
// 401 Unauthorized
{
  success: false,
  error: "Authentication required"
}

// 500 Internal Server Error
{
  success: false,
  error: "Failed to check watchlist status"
}
```

## Data Validation Schemas

### Request Validation (Zod)
```typescript
const AddWatchlistItemSchema = z.object({
  symbol: z.string()
    .min(1, "Symbol is required")
    .max(10, "Symbol too long")
    .transform(val => val.toUpperCase().trim()),
  company: z.string()
    .min(1, "Company name is required")
    .max(100, "Company name too long")
    .transform(val => val.trim())
});

const WatchlistStatusSchema = z.object({
  symbol: z.string()
    .min(1, "Symbol is required")
    .max(10, "Symbol too long")
    .transform(val => val.toUpperCase().trim())
});
```

### Response Validation (Zod)
```typescript
const WatchlistItemSchema = z.object({
  symbol: z.string(),
  company: z.string(),
  addedAt: z.string()
});

const WatchlistResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    watchlist: z.array(WatchlistItemSchema),
    count: z.number()
  })
});

const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string()
});
```

## Authentication & Authorization

### Authentication Method
- Better Auth 세션 기반 인증
- 쿠키 또는 Authorization 헤더 사용

### Authorization Rules
- 모든 엔드포인트는 인증된 사용자만 접근 가능
- 사용자는 자신의 관심종목만 조회/수정 가능
- 사용자 ID는 세션에서 추출

## Rate Limiting

### Limits
- 추가/제거 작업: 분당 60회
- 조회 작업: 분당 300회

### Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

## Error Handling

### Standard Error Format
```typescript
{
  success: false,
  error: string,
  code?: string,
  details?: any
}
```

### HTTP Status Codes
- `200` - 성공
- `400` - 잘못된 요청
- `401` - 인증 필요
- `404` - 리소스 없음
- `409` - 충돌 (중복)
- `413` - 페이로드 초과
- `429` - 요청 한도 초과
- `500` - 서버 오류

## Performance Requirements

### Response Times
- 조회 작업: < 200ms
- 추가/제거 작업: < 500ms
- 상태 확인: < 100ms

### Caching
- 사용자별 관심종목 목록: 5분 캐시
- 상태 확인: 1분 캐시

## Security Considerations

### Input Sanitization
- 모든 입력값 트림 및 대문자 변환
- SQL 인젝션 방지 (Mongoose 사용)
- XSS 방지 (입력값 검증)

### Data Protection
- 사용자 데이터는 해당 사용자만 접근 가능
- 민감한 정보 로깅 금지
- HTTPS 필수
