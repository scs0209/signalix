import { expect, test } from '@playwright/test';

/**
 * Watchlist E2E 테스트
 */

test.describe('Watchlist User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 사용자로 로그인 (실제 구현에서는 테스트 계정 사용)
    await page.goto('/sign-in');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'testpassword');
    await page.click('[data-testid="sign-in-button"]');

    // 로그인 완료 대기
    await page.waitForURL('/');
  });

  test('관심종목 추가 및 제거 플로우', async ({ page }) => {
    // 주식 상세 페이지로 이동
    await page.goto('/stocks/AAPL');

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="watchlist-button"]');

    // 초기 상태 확인 (관심종목에 없음)
    const watchlistButton = page.locator('[data-testid="watchlist-button"]');
    await expect(watchlistButton).toHaveText('Add to Watchlist');

    // 관심종목에 추가
    await watchlistButton.click();

    // 상태 변경 확인
    await expect(watchlistButton).toHaveText('Remove from Watchlist');

    // 성공 토스트 메시지 확인
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Added to watchlist');

    // 관심종목에서 제거
    await watchlistButton.click();

    // 상태 변경 확인
    await expect(watchlistButton).toHaveText('Add to Watchlist');

    // 성공 토스트 메시지 확인
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Removed from watchlist');
  });

  test('관심종목 상태 표시', async ({ page }) => {
    // 먼저 관심종목에 추가
    await page.goto('/stocks/AAPL');
    await page.waitForSelector('[data-testid="watchlist-button"]');
    await page.click('[data-testid="watchlist-button"]');

    // 다른 페이지로 이동 후 다시 돌아오기
    await page.goto('/');
    await page.goto('/stocks/AAPL');

    // 상태가 올바르게 표시되는지 확인
    const watchlistButton = page.locator('[data-testid="watchlist-button"]');
    await expect(watchlistButton).toHaveText('Remove from Watchlist');

    // 아이콘 상태도 확인
    const starIcon = page.locator('[data-testid="watchlist-star-icon"]');
    await expect(starIcon).toHaveClass(/watchlist-icon-added/);
  });

  test('중복 추가 방지', async ({ page }) => {
    await page.goto('/stocks/AAPL');
    await page.waitForSelector('[data-testid="watchlist-button"]');

    // 첫 번째 추가
    await page.click('[data-testid="watchlist-button"]');
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();

    // 두 번째 추가 시도 (이미 추가된 상태)
    await page.click('[data-testid="watchlist-button"]');

    // 오류 메시지 확인
    await expect(page.locator('[data-testid="toast-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-error"]')).toContainText('already in watchlist');
  });

  test('최대 개수 제한', async ({ page }) => {
    // 50개의 다른 주식을 관심종목에 추가 (테스트 데이터 사용)
    const symbols = ['GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX', 'AMD', 'INTC', 'CRM'];

    for (const symbol of symbols) {
      await page.goto(`/stocks/${symbol}`);
      await page.waitForSelector('[data-testid="watchlist-button"]');

      // 이미 추가된 경우 스킵
      const button = page.locator('[data-testid="watchlist-button"]');
      const buttonText = await button.textContent();

      if (buttonText?.includes('Add to Watchlist')) {
        await button.click();
        await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
      }
    }

    // 51번째 추가 시도
    await page.goto('/stocks/ORCL');
    await page.waitForSelector('[data-testid="watchlist-button"]');
    await page.click('[data-testid="watchlist-button"]');

    // 제한 오류 메시지 확인
    await expect(page.locator('[data-testid="toast-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-error"]')).toContainText('Maximum 50 items');
  });

  test('인증되지 않은 사용자 처리', async ({ page }) => {
    // 로그아웃
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="sign-out"]');

    // 주식 페이지로 이동
    await page.goto('/stocks/AAPL');

    // 관심종목 버튼이 비활성화되어 있는지 확인
    const watchlistButton = page.locator('[data-testid="watchlist-button"]');
    await expect(watchlistButton).toBeDisabled();

    // 툴팁 확인
    await watchlistButton.hover();
    await expect(page.locator('[data-testid="tooltip"]')).toBeVisible();
    await expect(page.locator('[data-testid="tooltip"]')).toContainText('Please sign in');
  });

  test('네트워크 오류 처리', async ({ page }) => {
    // 네트워크 오류 시뮬레이션
    await page.route('**/api/watchlist/**', (route) => {
      route.abort('failed');
    });

    await page.goto('/stocks/AAPL');
    await page.waitForSelector('[data-testid="watchlist-button"]');
    await page.click('[data-testid="watchlist-button"]');

    // 오류 메시지 확인
    await expect(page.locator('[data-testid="toast-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-error"]')).toContainText('network error');
  });

  test('오프라인 상태 처리', async ({ page }) => {
    // 오프라인 모드로 전환
    await page.context().setOffline(true);

    await page.goto('/stocks/AAPL');
    await page.waitForSelector('[data-testid="watchlist-button"]');

    // 버튼이 비활성화되어 있는지 확인
    const watchlistButton = page.locator('[data-testid="watchlist-button"]');
    await expect(watchlistButton).toBeDisabled();

    // 온라인 모드로 복구
    await page.context().setOffline(false);

    // 버튼이 다시 활성화되는지 확인
    await expect(watchlistButton).toBeEnabled();
  });

  test('동시성 처리 (Last Write Wins)', async ({ page, context }) => {
    // 두 개의 탭에서 동시에 작업
    const page1 = page;
    const page2 = await context.newPage();

    // 두 탭 모두에서 같은 주식 페이지 열기
    await page1.goto('/stocks/AAPL');
    await page2.goto('/stocks/AAPL');

    await page1.waitForSelector('[data-testid="watchlist-button"]');
    await page2.waitForSelector('[data-testid="watchlist-button"]');

    // 두 탭에서 동시에 클릭
    await Promise.all([
      page1.click('[data-testid="watchlist-button"]'),
      page2.click('[data-testid="watchlist-button"]'),
    ]);

    // 한 탭에서만 성공 메시지가 나타나는지 확인
    const successMessages = await Promise.all([
      page1.locator('[data-testid="toast-success"]').count(),
      page2.locator('[data-testid="toast-success"]').count(),
    ]);

    expect(successMessages[0] + successMessages[1]).toBe(1);

    await page2.close();
  });

  test('성능 요구사항 (2초 이내 응답)', async ({ page }) => {
    await page.goto('/stocks/AAPL');
    await page.waitForSelector('[data-testid="watchlist-button"]');

    // 응답 시간 측정
    const startTime = Date.now();
    await page.click('[data-testid="watchlist-button"]');
    await page.waitForSelector('[data-testid="toast-success"]');
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(2000); // 2초 이내
  });

  test('접근성 테스트', async ({ page }) => {
    await page.goto('/stocks/AAPL');
    await page.waitForSelector('[data-testid="watchlist-button"]');

    // 키보드 네비게이션 테스트
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // 상태 변경 확인
    await expect(page.locator('[data-testid="watchlist-button"]')).toHaveText('Remove from Watchlist');

    // 스크린 리더를 위한 aria-label 확인
    const watchlistButton = page.locator('[data-testid="watchlist-button"]');
    await expect(watchlistButton).toHaveAttribute('aria-label', 'Remove AAPL from watchlist');
  });
});
