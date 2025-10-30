# Tasks: User Watchlist Management

**Input**: Design documents from `/specs/001-user-watchlist/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/
**Tests**: 헌법의 "Testing Standards" 원칙에 따라 테스트 커버리지 80% 이상을 달성하기 위한 테스트 작업을 포함합니다.

**Organization**: 작업은 사용자 스토리별로 그룹화되어 각 스토리를 독립적으로 구현하고 테스트할 수 있습니다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 이 작업이 속한 사용자 스토리 (예: US1, US2, US3)
- 설명에 정확한 파일 경로 포함

## Path Conventions

- **Web app**: `app/`, `components/`, `lib/`, `database/`, `types/`
- 경로는 기존 Next.js 프로젝트 구조를 따릅니다

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 프로젝트 초기화 및 기본 구조

- [x] T001 Create API route structure for watchlist endpoints
- [x] T002 [P] Create Zod schemas for watchlist validation in lib/schemas/watchlist.ts
- [x] T003 [P] Create TypeScript types for watchlist in types/watchlist.d.ts
- [x] T004 [P] Create toast notification component in components/ui/toast.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 사용자 스토리 구현 전에 완료되어야 하는 핵심 인프라

**⚠️ CRITICAL**: 이 단계가 완료되기 전까지는 어떤 사용자 스토리 작업도 시작할 수 없습니다

- [x] T005 Extend existing WatchlistItem model in database/models/watchlist.model.ts
- [x] T006 [P] Create watchlist business logic in lib/actions/watchlist.actions.ts
- [x] T007 [P] Implement authentication middleware for API routes
- [x] T008 [P] Create error handling utilities in lib/utils.ts
- [x] T009 Setup database indexes for watchlist performance optimization
- [x] T010 [P] Create Zod validation schemas for WatchlistItem in lib/schemas/watchlist.ts
- [x] T011 [P] Implement database migration scripts for watchlist schema in database/migrations/
- [x] T012 [P] Add data validation middleware for watchlist operations in lib/middleware/validation.ts
- [x] T013 [P] Create database seed scripts for testing in database/seeds/watchlist.seed.ts
- [x] T014 [P] Implement input sanitization for watchlist data in lib/utils/sanitization.ts
- [x] T015 [P] Add CSRF protection for watchlist API endpoints in lib/middleware/csrf.ts
- [x] T016 [P] Implement rate limiting per user for watchlist operations in lib/middleware/rateLimit.ts
- [x] T017 [P] Add audit logging for watchlist operations in lib/utils/audit.ts
- [x] T018 [P] Create unit tests for WatchlistButton component in test/unit/WatchlistButton.test.tsx
- [x] T019 [P] Create unit tests for watchlist business logic in test/unit/watchlist.actions.test.ts
- [x] T020 [P] Create integration tests for watchlist API endpoints in test/integration/watchlist-api.test.ts
- [x] T021 [P] Create E2E tests for watchlist user flows in test/e2e/watchlist.spec.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Stock to Personal Watchlist (Priority: P1) 🎯 MVP

**Goal**: 인증된 사용자가 주식 상세 페이지에서 관심종목을 추가/제거할 수 있는 기능

**Independent Test**: 사용자가 주식 상세 페이지에서 "Add to Watchlist" 버튼을 클릭하고, 성공적으로 추가되었음을 확인할 수 있다.

### Implementation for User Story 1

- [x] T010 [P] [US1] Implement GET /api/watchlist endpoint in app/api/watchlist/route.ts
- [x] T011 [P] [US1] Implement POST /api/watchlist/[symbol] endpoint in app/api/watchlist/[symbol]/route.ts
- [x] T012 [P] [US1] Implement DELETE /api/watchlist/[symbol] endpoint in app/api/watchlist/[symbol]/route.ts
- [x] T013 [US1] Update WatchlistButton component to handle authentication in components/WatchlistButton.tsx
- [x] T014 [US1] Add watchlist toggle functionality to WatchlistButton component
- [x] T015 [US1] Integrate WatchlistButton with stock detail page in app/(main)/stocks/[symbol]/page.tsx
- [x] T016 [US1] Add error handling and user feedback for watchlist operations
- [x] T017 [US1] Add loading states and optimistic updates to WatchlistButton
- [x] T018 [P] [US1] Implement API response validation using Zod schemas per contracts
- [x] T019 [P] [US1] Add API error response formatting per contracts specification
- [x] T020 [P] [US1] Implement API rate limiting headers per contracts
- [x] T021 [P] [US1] Add API request/response logging per contracts
- [x] T022 [P] [US1] Implement API authentication validation per contracts
- [x] T023 [P] [US1] Add unit tests for watchlist API endpoints in test/unit/watchlist-api.test.ts
- [x] T024 [P] [US1] Add component tests for WatchlistButton authentication in test/unit/WatchlistButton.auth.test.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Personal Watchlist Status (Priority: P2)

**Goal**: 사용자가 주식 상세 페이지에서 해당 주식이 자신의 관심종목 목록에 포함되어 있는지 즉시 확인할 수 있는 기능

**Independent Test**: 사용자가 이미 관심종목에 추가된 주식 페이지를 방문했을 때, 버튼이 올바른 상태로 표시되는지 확인할 수 있다.

### Implementation for User Story 2

- [x] T018 [P] [US2] Implement GET /api/watchlist/[symbol]/status endpoint in app/api/watchlist/[symbol]/status/route.ts
- [x] T019 [US2] Add watchlist status checking logic to WatchlistButton component
- [x] T020 [US2] Implement initial state loading for WatchlistButton on page load
- [x] T021 [US2] Add visual indicators for watchlist status (star icon, button text)
- [x] T022 [US2] Handle authentication state changes in WatchlistButton
- [x] T023 [US2] Add offline state detection and disable functionality
- [x] T024 [P] [US2] Implement API response validation for status endpoint per contracts
- [x] T025 [P] [US2] Add API error handling for status endpoint per contracts
- [x] T026 [P] [US2] Implement API caching headers for status endpoint per contracts
- [x] T027 [P] [US2] Add unit tests for watchlist status API in test/unit/watchlist-status.test.ts
- [x] T028 [P] [US2] Add component tests for WatchlistButton status display in test/unit/WatchlistButton.status.test.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Handle Duplicate Watchlist Entries (Priority: P3)

**Goal**: 시스템이 사용자가 동일한 주식을 중복으로 관심종목에 추가하려고 할 때 적절히 처리하는 기능

**Independent Test**: 사용자가 이미 관심종목에 있는 주식을 다시 추가하려고 시도했을 때 시스템이 적절히 처리하는지 확인할 수 있다.

### Implementation for User Story 3

- [ ] T024 [P] [US3] Add duplicate prevention logic to addToWatchlist function
- [ ] T025 [US3] Implement watchlist limit checking (50 stocks per user)
- [ ] T026 [US3] Add proper error messages for duplicate and limit scenarios
- [ ] T027 [US3] Implement Last Write Wins conflict resolution for concurrent operations
- [ ] T028 [US3] Add validation for watchlist operations in API endpoints
- [ ] T029 [US3] Update WatchlistButton to handle duplicate and limit errors gracefully
- [ ] T030 [P] [US3] Implement API error responses for duplicate and limit scenarios per contracts
- [ ] T031 [P] [US3] Add API validation for duplicate prevention per contracts
- [ ] T032 [P] [US3] Implement API conflict resolution handling per contracts
- [ ] T033 [P] [US3] Add unit tests for duplicate prevention logic in test/unit/watchlist-duplicates.test.ts
- [ ] T034 [P] [US3] Add integration tests for watchlist limit scenarios in test/integration/watchlist-limits.test.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 여러 사용자 스토리에 영향을 주는 개선사항

- [ ] T030 [P] Add comprehensive error logging for watchlist operations
- [ ] T031 [P] Implement performance monitoring for watchlist API endpoints
- [ ] T032 [P] Add input sanitization and XSS protection
- [ ] T033 [P] Optimize database queries with proper indexing
- [ ] T034 [P] Add rate limiting for watchlist API endpoints
- [ ] T035 [P] Implement caching strategy for watchlist data
- [ ] T036 [P] Add accessibility improvements to WatchlistButton component
- [ ] T037 [P] Update documentation and code comments
- [ ] T038 [P] Add comprehensive E2E tests for complete watchlist user journey in test/e2e/watchlist-complete.spec.ts
- [ ] T039 [P] Add performance tests for watchlist API endpoints in test/performance/watchlist-api.test.ts
- [ ] T040 [P] Add security tests for watchlist authentication and authorization in test/security/watchlist-auth.test.ts
- [ ] T041 [P] Implement Redis caching for watchlist status checks to achieve <100ms response time
- [ ] T042 [P] Add database connection pooling optimization for concurrent watchlist operations
- [ ] T043 [P] Implement API response compression (gzip) for watchlist endpoints
- [ ] T044 [P] Add database query optimization with proper indexes for userId and symbol lookups
- [ ] T045 [P] Implement client-side caching for watchlist status to reduce API calls
- [ ] T046 [P] Add lazy loading for watchlist data to improve initial page load performance
- [ ] T047 [P] Implement batch operations for multiple watchlist updates
- [ ] T048 [P] Add database query result caching with TTL for frequently accessed watchlist data
- [ ] T049 [P] Optimize WatchlistButton component rendering with React.memo and useMemo
- [ ] T050 [P] Implement debounced API calls for watchlist operations to reduce server load

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- API endpoints before components
- Business logic before UI integration
- Error handling after core functionality
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All API endpoints within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all API endpoints for User Story 1 together:
Task: "Implement GET /api/watchlist endpoint in app/api/watchlist/route.ts"
Task: "Implement POST /api/watchlist/[symbol] endpoint in app/api/watchlist/[symbol]/route.ts"
Task: "Implement DELETE /api/watchlist/[symbol] endpoint in app/api/watchlist/[symbol]/route.ts"

# Launch component updates together:
Task: "Update WatchlistButton component to handle authentication in components/WatchlistButton.tsx"
Task: "Add watchlist toggle functionality to WatchlistButton component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
