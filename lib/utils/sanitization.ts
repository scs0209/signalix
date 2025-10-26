import DOMPurify from 'isomorphic-dompurify';

/**
 * 입력 데이터 살균화 유틸리티
 */

/**
 * 문자열에서 HTML 태그와 스크립트를 제거합니다.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // DOMPurify로 HTML 태그 제거
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  // 추가적인 특수 문자 제거
  return sanitized
    .replace(/[<>]/g, '') // 남은 < > 문자 제거
    .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
    .replace(/on\w+=/gi, '') // 이벤트 핸들러 제거
    .trim();
}

/**
 * 주식 심볼을 살균화합니다.
 */
export function sanitizeSymbol(symbol: string): string {
  if (typeof symbol !== 'string') {
    return '';
  }

  return symbol
    .toUpperCase()
    .replace(/[^A-Z0-9.-]/g, '') // 영문자, 숫자, 점, 하이픈만 허용
    .substring(0, 10) // 최대 10자로 제한
    .trim();
}

/**
 * 회사명을 살균화합니다.
 */
export function sanitizeCompanyName(companyName: string): string {
  if (typeof companyName !== 'string') {
    return '';
  }

  return sanitizeString(companyName)
    .substring(0, 100) // 최대 100자로 제한
    .trim();
}

/**
 * 사용자 ID를 살균화합니다.
 */
export function sanitizeUserId(userId: string): string {
  if (typeof userId !== 'string') {
    return '';
  }

  return userId
    .replace(/[^a-zA-Z0-9-_]/g, '') // 영문자, 숫자, 하이픈, 언더스코어만 허용
    .substring(0, 50) // 최대 50자로 제한
    .trim();
}

/**
 * 관심종목 데이터를 살균화합니다.
 */
export function sanitizeWatchlistData(data: { symbol?: string; company?: string; userId?: string }): {
  symbol: string;
  company: string;
  userId: string;
} {
  return {
    symbol: sanitizeSymbol(data.symbol || ''),
    company: sanitizeCompanyName(data.company || ''),
    userId: sanitizeUserId(data.userId || ''),
  };
}

/**
 * URL을 살균화합니다.
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  try {
    const urlObj = new URL(url);

    // 허용된 프로토콜만 허용
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return '';
    }

    return urlObj.toString();
  } catch {
    return '';
  }
}

/**
 * JSON 데이터를 살균화합니다.
 */
export function sanitizeJsonData(data: unknown): unknown {
  if (typeof data === 'string') {
    return sanitizeString(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeJsonData(item));
  }

  if (data && typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = sanitizeString(key);
      if (sanitizedKey) {
        sanitized[sanitizedKey] = sanitizeJsonData(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * SQL 인젝션 방지를 위한 문자열 이스케이프
 */
export function escapeSqlString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(String.fromCharCode(0x1a), '\\Z');
}

/**
 * XSS 공격 방지를 위한 문자열 검증
 */
export function isSafeString(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i,
    /<style/i,
    /expression\s*\(/i,
    /url\s*\(/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(input));
}
