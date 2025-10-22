<!--
Sync Impact Report:
Version change: 1.0.0 → 1.0.1
Modified principles: 
  - III. Test-Driven Development → III. Testing Standards (TDD 필수 요구사항 제거)
  - Code Organization 섹션에서 FSD 아키텍처 참조 제거
Added sections: None
Removed sections: None
Templates requiring updates: 
  ✅ plan-template.md (Constitution Check section ready)
  ✅ spec-template.md (user story structure aligns)
  ✅ tasks-template.md (task organization aligns)
Follow-up TODOs: None
Last updated: 2025-10-22
-->

# Signalix Constitution

## Core Principles

### I. Component-First Architecture
모든 기능은 재사용 가능한 컴포넌트로 시작한다. 컴포넌트는 독립적으로 테스트 가능하고 문서화되어야 하며, 명확한 목적이 있어야 한다. 조직적 목적만을 위한 컴포넌트는 금지된다.

### II. Type-Safe Development (NON-NEGOTIABLE)
TypeScript는 필수이며 모든 코드는 타입 안전성을 보장해야 한다. any 타입 사용은 금지되며, 모든 API 응답과 데이터 모델은 Zod 스키마로 검증해야 한다.

### III. Testing Standards
테스트는 코드 품질과 안정성을 보장하는 핵심 요소이다. 단위 테스트, 통합 테스트, E2E 테스트를 적절히 조합하여 사용한다. 테스트 커버리지는 최소 80% 이상을 유지한다.

### IV. Integration Testing Focus
다음 영역에 대한 통합 테스트 필수: 새로운 API 엔드포인트, 데이터베이스 스키마 변경, 외부 API 통신 (Finnhub), 인증/인가 플로우

### V. Performance & Observability
모든 API 호출은 적절한 캐싱과 디바운싱을 구현해야 한다. 구조화된 로깅이 필수이며, 사용자 경험에 영향을 주는 성능 지표를 모니터링해야 한다.

### VI. Security-First Approach
모든 사용자 입력은 검증되어야 하며, 인증된 사용자만 민감한 데이터에 접근할 수 있어야 한다. 환경 변수와 시크릿은 안전하게 관리되어야 한다.

## Development Standards

### Technology Stack Requirements
- **Frontend**: Next.js 15+, React 19+, TypeScript 5+
- **Styling**: Tailwind CSS 4+, Radix UI 컴포넌트
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Better Auth
- **Testing**: Vitest, Playwright, Testing Library
- **Code Quality**: Biome (linting & formatting)

### Code Organization
- 컴포넌트는 `components/` 디렉토리에 기능별로 분류
- 비즈니스 로직은 `lib/actions/`에 위치
- 데이터 모델은 `database/models/`에 정의
- 타입 정의는 `types/` 디렉토리에 중앙화
- 명확한 책임 분리와 모듈화 원칙 준수

## Development Workflow

### Code Review Requirements
- 모든 PR은 헌법 준수를 검증해야 함
- 복잡성은 명확한 정당화가 필요
- 테스트 커버리지가 충분해야 함
- 타입 안전성이 보장되어야 함

### Quality Gates
- 린트 오류 0개
- 타입 오류 0개
- 테스트 실패 0개
- 빌드 성공 필수

## Governance

헌법은 모든 다른 관행보다 우선한다. 수정사항은 문서화, 승인, 마이그레이션 계획이 필요하다.

모든 PR/리뷰는 준수 여부를 검증해야 한다. 복잡성은 정당화되어야 한다. 런타임 개발 가이드는 README.md를 참조한다.

**Version**: 1.0.1 | **Ratified**: 2025-10-22 | **Last Amended**: 2025-10-22