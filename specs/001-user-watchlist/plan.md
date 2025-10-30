# Implementation Plan: User Watchlist Management

**Branch**: `001-user-watchlist` | **Date**: 2025-10-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-user-watchlist/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

사용자별 개인 관심종목 관리 기능을 구현한다. 인증된 사용자가 주식 상세 페이지에서 관심종목을 추가/제거할 수 있으며, 상태를 실시간으로 확인할 수 있다. 기존 WatchlistButton 컴포넌트와 MongoDB 데이터 모델을 활용하여 구현한다.

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 15+, React 19+  
**Primary Dependencies**: Better Auth (인증), Mongoose (데이터베이스), Tailwind CSS (스타일링), Radix UI (컴포넌트)  
**Storage**: MongoDB with Mongoose ODM  
**Testing**: Vitest (단위 테스트), Playwright (E2E 테스트), Testing Library (컴포넌트 테스트)  
**Target Platform**: Web application (Next.js)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: 관심종목 추가/제거 2초 이내, 페이지 로드 시 상태 표시 99% 정확도  
**Constraints**: 사용자당 최대 50개 관심종목, 오프라인 시 기능 비활성화, 네트워크 오류 시 토스트 알림  
**Scale/Scope**: 단일 웹 애플리케이션, 기존 프로젝트 구조 활용

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Component-First Architecture
- 기존 WatchlistButton 컴포넌트 활용
- 재사용 가능한 컴포넌트 구조 유지
- 독립적 테스트 가능한 컴포넌트 설계

### ✅ Type-Safe Development (NON-NEGOTIABLE)
- TypeScript 사용 필수
- Zod 스키마로 API 응답 검증
- any 타입 사용 금지

### ✅ Testing Standards
- 단위 테스트: WatchlistButton 컴포넌트
- 통합 테스트: API 엔드포인트 및 데이터베이스 연동
- E2E 테스트: 사용자 시나리오 검증
- 테스트 커버리지 80% 이상 목표

### ✅ Integration Testing Focus
- 새로운 API 엔드포인트 테스트 필수
- 데이터베이스 스키마 변경 테스트
- 인증/인가 플로우 테스트

### ✅ Performance & Observability
- API 호출 최적화 및 캐싱 구현
- 구조화된 로깅 구현
- 성능 지표 모니터링

### ✅ Security-First Approach
- 사용자 입력 검증 필수
- 인증된 사용자만 접근 가능
- 환경 변수 안전 관리

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (main)/
│   └── stocks/
│       └── [symbol]/
│           └── page.tsx          # 주식 상세 페이지 (WatchlistButton 사용)
├── api/
│   └── watchlist/
│       ├── route.ts              # 관심종목 API 엔드포인트
│       └── [symbol]/
│           └── route.ts         # 특정 주식 관심종목 관리

components/
├── WatchlistButton.tsx           # 기존 컴포넌트 (수정 필요)
└── ui/
    └── toast.tsx                 # 토스트 알림 컴포넌트

lib/
├── actions/
│   └── watchlist.actions.ts     # 관심종목 비즈니스 로직
├── schemas/
│   └── watchlist.ts             # Zod 스키마 정의
└── utils.ts                     # 유틸리티 함수

database/
└── models/
    └── watchlist.model.ts       # 기존 모델 (확장 필요)

types/
└── watchlist.d.ts               # 타입 정의

test/
├── unit/
│   └── WatchlistButton.test.tsx # 컴포넌트 단위 테스트
├── integration/
│   └── watchlist-api.test.ts    # API 통합 테스트
└── e2e/
    └── watchlist.spec.ts        # E2E 테스트
```

**Structure Decision**: 기존 Next.js 웹 애플리케이션 구조를 활용한다. 컴포넌트는 `components/`에, 비즈니스 로직은 `lib/actions/`에, 데이터 모델은 `database/models/`에 위치한다. API 라우트는 `app/api/`에 RESTful 패턴으로 구성한다.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
