# 테스트 설정

이 프로젝트는 단위 테스트를 위해 Vitest를, E2E 테스트를 위해 Playwright를 사용합니다.

## 테스트 구조

```
test/
├── unit/           # 단위 테스트 (Vitest)
├── integration/    # 통합 테스트 (Vitest)
├── e2e/            # E2E 테스트 (Playwright)
├── setup.ts        # 테스트 설정 파일
└── vitest.d.ts     # TypeScript 타입 선언
```

## 테스트 실행

### 단위 테스트 (Vitest)
```bash
# 단위 테스트를 watch 모드로 실행
pnpm test

# 단위 테스트를 한 번 실행
pnpm test:run

# UI와 함께 단위 테스트 실행
pnpm test:ui

# 커버리지와 함께 단위 테스트 실행
pnpm test:coverage

# 특정 파일만 실행
pnpm test:filter [파일명]
```

### E2E 테스트 (Playwright)
```bash
# E2E 테스트 실행
pnpm test:e2e

# UI와 함께 E2E 테스트 실행
pnpm test:e2e:ui

# 브라우저가 보이는 모드로 E2E 테스트 실행
pnpm test:e2e:headed
```

### 모든 테스트
```bash
# 단위 테스트와 E2E 테스트 모두 실행
pnpm test:all
```

## 테스트 작성

### 단위 테스트
- `test/unit/` 디렉토리에 단위 테스트 파일을 배치
- `.test.tsx` 또는 `.test.ts` 확장자 사용
- `@testing-library/react`와 `@testing-library/user-event`에서 테스트 유틸리티 import

### 통합 테스트
- `test/integration/` 디렉토리에 통합 테스트 파일을 배치
- `.test.ts` 확장자 사용
- API route handler를 직접 호출하여 테스트

### E2E 테스트
- `test/e2e/` 디렉토리에 E2E 테스트 파일을 배치
- `.spec.ts` 확장자 사용
- 전체 애플리케이션 플로우를 테스트

## 설정 파일

- `vitest.config.mts` - Vitest 설정
- `playwright.config.ts` - Playwright 설정
- `test/setup.ts` - 전역 테스트 설정
- `test/vitest.d.ts` - 테스트용 TypeScript 타입 선언

