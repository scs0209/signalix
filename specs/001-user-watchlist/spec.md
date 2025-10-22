# Feature Specification: User Watchlist Management

**Feature Branch**: `001-user-watchlist`  
**Created**: 2025-10-22  
**Status**: Draft  
**Input**: User description: "@WatchlistButton.tsx @page.tsx 유저마다 Watchlist를 추가하는 기능 추가할거야"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Stock to Personal Watchlist (Priority: P1)

인증된 사용자가 주식 상세 페이지에서 관심종목 버튼을 클릭하여 자신의 개인 관심종목 목록에 주식을 추가할 수 있다.

**Why this priority**: 사용자가 관심있는 주식을 추적할 수 있는 핵심 기능으로, 플랫폼의 기본 가치를 제공한다.

**Independent Test**: 사용자가 주식 상세 페이지에서 "Add to Watchlist" 버튼을 클릭하고, 성공적으로 추가되었음을 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** 사용자가 인증되어 있고 주식 상세 페이지에 있다, **When** "Add to Watchlist" 버튼을 클릭한다, **Then** 주식이 사용자의 관심종목 목록에 추가되고 버튼이 "Remove from Watchlist"로 변경된다
2. **Given** 사용자가 이미 해당 주식을 관심종목에 추가한 상태이다, **When** "Remove from Watchlist" 버튼을 클릭한다, **Then** 주식이 관심종목 목록에서 제거되고 버튼이 "Add to Watchlist"로 변경된다

---

### User Story 2 - View Personal Watchlist Status (Priority: P2)

사용자가 주식 상세 페이지에서 해당 주식이 자신의 관심종목 목록에 포함되어 있는지 즉시 확인할 수 있다.

**Why this priority**: 사용자 경험을 위해 현재 상태를 명확히 표시해야 한다.

**Independent Test**: 사용자가 이미 관심종목에 추가된 주식 페이지를 방문했을 때, 버튼이 올바른 상태로 표시되는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** 사용자가 관심종목에 추가한 주식의 상세 페이지에 있다, **When** 페이지를 로드한다, **Then** 버튼이 "Remove from Watchlist" 상태로 표시된다
2. **Given** 사용자가 관심종목에 추가하지 않은 주식의 상세 페이지에 있다, **When** 페이지를 로드한다, **Then** 버튼이 "Add to Watchlist" 상태로 표시된다

---

### User Story 3 - Handle Duplicate Watchlist Entries (Priority: P3)

시스템이 사용자가 동일한 주식을 중복으로 관심종목에 추가하려고 할 때 적절히 처리한다.

**Why this priority**: 데이터 무결성과 사용자 경험을 보장하기 위해 필요하다.

**Independent Test**: 사용자가 이미 관심종목에 있는 주식을 다시 추가하려고 시도했을 때 시스템이 적절히 처리하는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** 사용자가 이미 관심종목에 추가한 주식이 있다, **When** 동일한 주식을 다시 추가하려고 시도한다, **Then** 시스템이 중복 추가를 방지하고 기존 항목을 유지한다

### Edge Cases

- 사용자가 인증되지 않은 상태에서 관심종목 버튼을 클릭할 때 버튼을 비활성화하고 툴팁을 표시한다
- 네트워크 오류로 인해 관심종목 추가/제거가 실패할 때 토스트 알림으로 오류 메시지를 표시한다
- 사용자가 동시에 여러 탭에서 같은 주식의 관심종목 상태를 변경할 때 마지막 작업을 우선한다 (Last Write Wins)
- 사용자가 관심종목 50개 제한에 도달했을 때 추가 시도 시 적절한 알림을 표시한다
- 오프라인 상태에서는 관심종목 기능을 비활성화한다

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to add stocks to their personal watchlist
- **FR-002**: System MUST allow authenticated users to remove stocks from their personal watchlist  
- **FR-003**: System MUST display current watchlist status for each stock to authenticated users
- **FR-004**: System MUST prevent duplicate watchlist entries per user
- **FR-005**: System MUST persist watchlist data across user sessions
- **FR-006**: System MUST handle watchlist operations gracefully when network errors occur
- **FR-007**: System MUST provide visual feedback for watchlist add/remove operations
- **FR-008**: System MUST limit watchlist entries to maximum 50 stocks per user

### Key Entities *(include if feature involves data)*

- **WatchlistItem**: 사용자의 개인 관심종목 항목을 나타내며, 사용자 ID, 주식 심볼, 회사명, 추가일시를 포함한다
- **User**: 인증된 사용자로, 고유 ID와 이메일을 가지며 여러 WatchlistItem과 연결된다

## Clarifications

### Session 2025-10-22

- Q: 인증되지 않은 사용자가 관심종목 버튼을 클릭할 때 어떻게 처리할 것인가? → A: 버튼 비활성화 및 툴팁 표시
- Q: 네트워크 오류로 인해 관심종목 추가/제거가 실패할 때 사용자에게 어떻게 알릴 것인가? → A: 토스트 알림으로 오류 메시지 표시
- Q: 사용자가 동시에 여러 탭에서 같은 주식의 관심종목 상태를 변경할 때 어떻게 처리할 것인가? → A: 마지막 작업 우선 (Last Write Wins)
- Q: 사용자당 관심종목 최대 개수 제한은 어떻게 할 것인가? → A: 50개로 제한
- Q: 오프라인 상태에서 관심종목 기능은 어떻게 동작할 것인가? → A: 오프라인 시 기능 비활성화

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a stock to their watchlist in under 2 seconds
- **SC-002**: Users can remove a stock from their watchlist in under 2 seconds  
- **SC-003**: Watchlist status is displayed correctly for 99% of page loads
- **SC-004**: System prevents duplicate watchlist entries with 100% accuracy
- **SC-005**: 95% of watchlist operations complete successfully without errors