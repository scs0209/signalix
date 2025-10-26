/**
 * 감사 로깅 유틸리티
 */

interface AuditLogEntry {
  timestamp: Date;
  userId: string;
  action: WatchlistAction;
  symbol?: string;
  success: boolean;
  error?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

interface AuditLogConfig {
  enabled: boolean;
  logLevel: 'info' | 'warn' | 'error';
  includeMetadata: boolean;
  maxLogEntries: number;
}

const DEFAULT_CONFIG: AuditLogConfig = {
  enabled: true,
  logLevel: 'info',
  includeMetadata: true,
  maxLogEntries: 1000,
};

// 메모리 기반 로그 저장소 (프로덕션에서는 데이터베이스나 외부 로깅 서비스 사용)
const auditLogs: AuditLogEntry[] = [];

/**
 * 감사 로그를 기록합니다.
 */
export function logAuditEvent(
  userId: string,
  action: WatchlistAction,
  success: boolean,
  options: {
    symbol?: string;
    error?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  } = {},
): void {
  if (!DEFAULT_CONFIG.enabled) {
    return;
  }

  const logEntry: AuditLogEntry = {
    timestamp: new Date(),
    userId,
    action,
    symbol: options.symbol,
    success,
    error: options.error,
    ipAddress: options.ipAddress,
    userAgent: options.userAgent,
    metadata: DEFAULT_CONFIG.includeMetadata ? options.metadata : undefined,
  };

  // 로그 저장
  auditLogs.push(logEntry);

  // 최대 로그 수 제한
  if (auditLogs.length > DEFAULT_CONFIG.maxLogEntries) {
    auditLogs.shift(); // 가장 오래된 로그 제거
  }

  // 콘솔 로깅 (프로덕션에서는 구조화된 로깅 시스템 사용)
  const logLevel = success ? 'info' : 'error';
  const actionText =
    {
      add: '추가',
      remove: '제거',
      check: '상태확인',
      list: '목록조회',
    }[action] || action;

  const message = `관심종목 ${actionText}: ${success ? '성공' : '실패'} - 사용자: ${userId}${options.symbol ? `, 심볼: ${options.symbol}` : ''}`;

  if (logLevel === 'error' || DEFAULT_CONFIG.logLevel === 'info') {
    console.log(`[감사로그] ${message}`, {
      timestamp: logEntry.timestamp.toISOString(),
      userId,
      action,
      symbol: options.symbol,
      success,
      error: options.error,
      metadata: options.metadata,
    });
  }
}

/**
 * 관심종목 추가 감사 로그
 */
export function logWatchlistAdd(
  userId: string,
  symbol: string,
  success: boolean,
  error?: string,
  metadata?: Record<string, unknown>,
): void {
  logAuditEvent(userId, 'add', success, {
    symbol,
    error,
    metadata,
  });
}

/**
 * 관심종목 제거 감사 로그
 */
export function logWatchlistRemove(
  userId: string,
  symbol: string,
  success: boolean,
  error?: string,
  metadata?: Record<string, unknown>,
): void {
  logAuditEvent(userId, 'remove', success, {
    symbol,
    error,
    metadata,
  });
}

/**
 * 관심종목 상태 확인 감사 로그
 */
export function logWatchlistCheck(
  userId: string,
  symbol: string,
  success: boolean,
  error?: string,
  metadata?: Record<string, unknown>,
): void {
  logAuditEvent(userId, 'check', success, {
    symbol,
    error,
    metadata,
  });
}

/**
 * 관심종목 목록 조회 감사 로그
 */
export function logWatchlistList(
  userId: string,
  success: boolean,
  error?: string,
  metadata?: Record<string, unknown>,
): void {
  logAuditEvent(userId, 'list', success, {
    error,
    metadata,
  });
}

/**
 * 사용자별 감사 로그 조회
 */
export function getAuditLogsForUser(userId: string, limit: number = 100): AuditLogEntry[] {
  return auditLogs
    .filter((log) => log.userId === userId)
    .slice(-limit)
    .reverse(); // 최신순으로 정렬
}

/**
 * 특정 기간의 감사 로그 조회
 */
export function getAuditLogsByDateRange(startDate: Date, endDate: Date, limit: number = 1000): AuditLogEntry[] {
  return auditLogs
    .filter((log) => log.timestamp >= startDate && log.timestamp <= endDate)
    .slice(-limit)
    .reverse();
}

/**
 * 실패한 작업만 조회
 */
export function getFailedAuditLogs(limit: number = 100): AuditLogEntry[] {
  return auditLogs
    .filter((log) => !log.success)
    .slice(-limit)
    .reverse();
}

/**
 * 감사 로그 통계
 */
export function getAuditLogStats(): {
  totalLogs: number;
  successCount: number;
  failureCount: number;
  actionStats: Record<WatchlistAction, number>;
  recentActivity: AuditLogEntry[];
} {
  const recentActivity = auditLogs.slice(-10).reverse();
  const successCount = auditLogs.filter((log) => log.success).length;
  const failureCount = auditLogs.length - successCount;

  const actionStats: Record<WatchlistAction, number> = {
    add: 0,
    remove: 0,
    check: 0,
    list: 0,
  };

  auditLogs.forEach((log) => {
    actionStats[log.action]++;
  });

  return {
    totalLogs: auditLogs.length,
    successCount,
    failureCount,
    actionStats,
    recentActivity,
  };
}

/**
 * 감사 로그 정리 (오래된 로그 제거)
 */
export function cleanupAuditLogs(olderThanDays: number = 30): void {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const initialLength = auditLogs.length;

  // 오래된 로그 제거
  for (let i = auditLogs.length - 1; i >= 0; i--) {
    if (auditLogs[i].timestamp < cutoffDate) {
      auditLogs.splice(i, 1);
    }
  }

  const removedCount = initialLength - auditLogs.length;
  console.log(`${removedCount}개의 오래된 감사 로그를 정리했습니다`);
}

/**
 * 감사 로그 내보내기 (백업용)
 */
export function exportAuditLogs(): string {
  return JSON.stringify(auditLogs, null, 2);
}

/**
 * 감사 로그 가져오기 (복원용)
 */
export function importAuditLogs(logsJson: string): void {
  try {
    const importedLogs: AuditLogEntry[] = JSON.parse(logsJson);
    auditLogs.push(...importedLogs);
    console.log(`${importedLogs.length}개의 감사 로그를 가져왔습니다`);
  } catch (error) {
    console.error('감사 로그 가져오기 실패:', error);
    throw new Error('잘못된 감사 로그 형식입니다');
  }
}
