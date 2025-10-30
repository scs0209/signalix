# Data Model: User Watchlist Management

**Feature**: User Watchlist Management  
**Date**: 2025-10-22  
**Status**: Complete

## Entity Definitions

### WatchlistItem
사용자의 개인 관심종목 항목을 나타내는 엔티티

**Attributes**:
- `userId: string` - 사용자 고유 식별자 (필수, 인덱스)
- `symbol: string` - 주식 심볼 (필수, 대문자, 트림)
- `company: string` - 회사명 (필수, 트림)
- `addedAt: Date` - 추가일시 (기본값: 현재 시간)

**Constraints**:
- `userId`와 `symbol`의 조합은 유일해야 함 (복합 인덱스)
- `symbol`은 대문자로 저장
- 최대 길이 제한: `symbol` 10자, `company` 100자

**Relationships**:
- `User` 1:N `WatchlistItem` (한 사용자가 여러 관심종목 보유)

### User (기존 엔티티 확장)
인증된 사용자 엔티티 (Better Auth에서 관리)

**Attributes**:
- `id: string` - 사용자 고유 식별자
- `email: string` - 이메일 주소

**Relationships**:
- `User` 1:N `WatchlistItem` (한 사용자가 여러 관심종목 보유)

## Database Schema

### Watchlist Collection
```typescript
{
  _id: ObjectId,
  userId: string,        // 인덱스
  symbol: string,       // 대문자, 트림
  company: string,      // 트림
  addedAt: Date,        // 기본값: Date.now()
  createdAt: Date,      // Mongoose 자동 생성
  updatedAt: Date       // Mongoose 자동 생성
}
```

### Indexes
```typescript
// 복합 인덱스 (유니크)
{ userId: 1, symbol: 1 }

// 사용자별 조회 최적화
{ userId: 1 }
```

## Validation Rules

### Input Validation (Zod Schema)
```typescript
const WatchlistItemSchema = z.object({
  symbol: z.string()
    .min(1, "Symbol is required")
    .max(10, "Symbol too long")
    .transform(val => val.toUpperCase().trim()),
  company: z.string()
    .min(1, "Company name is required")
    .max(100, "Company name too long")
    .transform(val => val.trim())
});
```

### Business Rules
1. 사용자당 최대 50개 관심종목 제한
2. 중복 심볼 추가 방지 (userId + symbol 유니크)
3. 존재하지 않는 심볼 추가 방지 (외부 API 검증 필요)

## State Transitions

### WatchlistItem Lifecycle
```
[Not Added] --(add)--> [Added] --(remove)--> [Not Added]
```

### State Validation
- **Add**: 사용자 인증 확인, 중복 확인, 개수 제한 확인
- **Remove**: 사용자 인증 확인, 소유권 확인

## Data Access Patterns

### Read Operations
- 사용자별 관심종목 목록 조회: `find({ userId })`
- 특정 주식의 관심종목 상태 확인: `findOne({ userId, symbol })`
- 사용자별 관심종목 개수 확인: `countDocuments({ userId })`

### Write Operations
- 관심종목 추가: `create({ userId, symbol, company })`
- 관심종목 제거: `deleteOne({ userId, symbol })`

## Performance Considerations

### Query Optimization
- 복합 인덱스로 사용자별 조회 최적화
- 페이지네이션 고려 (향후 확장 시)

### Caching Strategy
- 사용자별 관심종목 목록 캐싱
- 페이지 로드 시 상태 확인 최적화

## Migration Considerations

### Existing Data
- 기존 WatchlistItem 모델 확장 없이 활용
- 기존 인덱스 구조 유지

### Future Extensions
- 관심종목 그룹화 기능
- 알림 설정 기능
- 관심종목 순서 관리
