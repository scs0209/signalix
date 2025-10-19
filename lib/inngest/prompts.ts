export const PERSONALIZED_WELCOME_EMAIL_PROMPT = `
다음은 이메일 템플릿의 {{intro}} 부분에 삽입될 개인화된 HTML 문단을 생성하기 위한 지시문입니다.

사용자 프로필 데이터:
{{userProfile}}

개인화 규칙:
아래 조건을 모두 충족하는, 자연스럽고 세련된 **한국어 인사 문단(HTML)**을 생성하세요.

중요: 이메일 헤더에는 이미 "환영합니다, {{name}}님"이라는 문구가 포함되어 있으므로,
본문에서는 "환영합니다"로 시작하지 마세요.  
대신 다음과 같은 자연스러운 시작 표현을 사용하세요:
- “가입해주셔서 감사합니다.”
- “함께하게 되어 반갑습니다.”
- “투자 여정의 시작을 응원합니다.”
- “좋은 시기에 오셨습니다.”

### 1. 사용자 정보 직접 반영
다음 정보를 활용하여 문장 안에 구체적으로 녹여야 합니다:
- 투자 목표 (예: 장기 성장, 은퇴 준비, 단기 수익 등)
- 위험 성향 (예: 안정형, 중간형, 공격형)
- 선호 산업/섹터 (예: 기술주, 헬스케어, 에너지 등)
- 투자 경험 수준 (예: 초보자, 숙련자 등)
- 관심 기업/종목
- 투자 기간 (단기, 장기, 은퇴 대비 등)

### 2. 맥락 기반 메시지
사용자의 상황을 이해한 듯한 문장을 구성하세요:
- 초보 투자자 → “기초부터 차근히 배우며 시작할 수 있도록 도와드립니다.”
- 숙련 투자자 → “시장 흐름을 빠르게 파악할 수 있는 고급 도구를 제공합니다.”
- 은퇴 대비 투자 → “안정적인 자산 성장을 위한 정보를 제공합니다.”
- 보수적 투자 성향 → “안정성과 신뢰를 중시하는 전략을 제안합니다.”
- 공격적 투자 성향 → “빠르게 성장하는 기회를 함께 포착합니다.”

### 3. 개인적인 터치
- 사용자의 목표, 관심 분야를 구체적으로 언급하세요.
- ‘우리 서비스가 왜 이 사용자에게 맞는지’ 문맥상 자연스럽게 연결하세요.

### 형식 요건 (중요)
- 오직 아래 형식의 HTML 문단만 반환하세요 (Markdown, 코드 블록 금지)
<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; color: #CCDADC;">내용</p>
- 문장 수: **정확히 2문장**
- 전체 글자 수: 약 **45~65자**
- 주요 단어(투자 목표, 관심 산업 등)는 <strong>태그로 강조</strong>
- “지금 바로 시작하세요” 같은 CTA 문구는 포함하지 마세요 (템플릿에 이미 있음)
- 자연스러운 한국어 문체로, ‘한 사람을 위한 이메일’처럼 느껴지게 작성하세요.

출력 예시:
<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; color: #CCDADC;">가입해주셔서 감사합니다. <strong>기술주 중심의 성장 투자</strong>에 관심 있는 분이라면, 빠르게 변하는 시장 흐름 속에서도 자신 있게 결정하실 수 있을 거예요.</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; color: #CCDADC;">함께하게 되어 반갑습니다. <strong>은퇴 대비 안정형 포트폴리오</strong>를 목표로 하신다면, 꾸준한 수익과 신뢰할 수 있는 인사이트를 함께 제공해드릴게요.</p>
`;

export const NEWS_SUMMARY_EMAIL_PROMPT = `뉴스 요약 이메일용 HTML 콘텐츠를 생성하세요. 이 콘텐츠는 NEWS_SUMMARY_EMAIL_TEMPLATE의 {{newsContent}} 자리(place holder)에 삽입됩니다.

요약해야 할 뉴스 데이터:
{{newsData}}

중요한 포맷 요구사항:
- 마크다운, 코드 블록, 백틱 없이 **깨끗한 HTML 콘텐츠만** 반환해야 합니다.
- HTML 구조는 명확한 섹션 구분과 제목/본문 단락으로 구성되어야 합니다.
- 아래의 CSS 클래스 및 스타일을 반드시 사용하세요 (이메일 템플릿 일관성 유지 목적):

섹션 제목(예: "시장 하이라이트", "상승 종목", 등):
<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">섹션 제목</h3>

본문 단락:
<p class="mobile-text dark-text-secondary" style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">내용 입력</p>

주식/회사 언급:
<strong style="color: #FDD458;">티커 심볼</strong> — 종목 코드 표기  
<strong style="color: #CCDADC;">회사명</strong> — 회사명 표기

성과 표시 이모지:
📈 상승 / 📉 하락 / 📊 혼조

뉴스 기사 구조:
각 뉴스 항목은 다음과 같은 구조를 따라야 합니다.
1. 기사 컨테이너(시각적 구분용 박스)
2. 기사 제목 (소제목 형태)
3. 핵심 요약 포인트 (2~3개 간결한 인사이트)
4. "이 뉴스의 의미" 섹션 (맥락 설명)
5. 원문 기사 링크 ("자세히 보기")
6. 기사 간 시각적 구분선(divider)

기사 컨테이너:
<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">

기사 제목:
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FFFFFF; line-height: 1.4;">
기사 제목 입력
</h4>

요약 포인트 (최소 3개):
<ul style="margin: 16px 0 20px 0; padding-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>일반 독자가 빠르게 이해할 수 있는 간결한 설명.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>핵심 수치와 그 의미를 일상적인 언어로 간략히 설명.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>일반 투자자에게 이 뉴스가 어떤 의미가 있는지 간단히 요약.
  </li>
</ul>

인사이트 섹션:
<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">핵심 요약:</strong> 이 뉴스가 여러분의 자산이나 투자 판단에 어떤 의미를 가지는지 쉽게 설명해주세요.</p>
</div>

자세히 보기 버튼:
<div style="margin: 20px 0 0 0;">
<a href="ARTICLE_URL" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">전체 기사 보기 →</a>
</div>

기사 구분선:
</div>

섹션 구분선:
<div style="border-top: 1px solid #374151; margin: 32px 0 24px 0;"></div>

콘텐츠 작성 가이드라인:
- 뉴스는 의미 있는 주제별 섹션으로 나누세요. (📊 시장 요약, 📈 상승 종목, 📉 하락 종목, 🔥 속보, 💼 실적 발표, 🏛️ 경제 데이터 등)
- 섹션 제목은 중복 없이 한 번만 사용하세요.
- 각 기사에는 실제 뉴스 데이터의 제목을 포함해야 합니다.
- 최소 3개의 간결한 포인트를 포함해야 하며, “핵심 요약” 등의 라벨은 붙이지 마세요.
- 각 포인트는 한 문장으로 짧고 명확하게 작성하세요.
- 복잡한 금융 용어 대신 누구나 이해할 수 있는 쉬운 한국어를 사용하세요.
- 구체적인 숫자는 포함하되, 그 의미를 쉽게 설명하세요.
- “핵심 요약(Bottom Line)”에서는 이 뉴스가 투자자에게 어떤 의미가 있는지 일상적인 언어로 설명하세요.
- 노란색 불릿(•)을 사용해 가독성을 높이세요.
- 각 기사는 명확한 간격과 시각적 구조로 쉽게 스캔 가능해야 합니다.
- 모든 기사에 “전체 기사 보기” 버튼과 실제 URL을 포함하세요.
- 뉴스의 실질적 의미를 강조하세요 — “이 뉴스가 내 돈에 어떤 영향을 주는가?”
- 문체는 친근하고, 명확하며, 짧게 유지하세요.

예시 구조:
<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 20px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">📊 시장 요약</h3>

<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FDD458; line-height: 1.4;">
오늘 주식시장은 혼조세를 보였습니다
</h4>

<ul style="margin: 16px 0 20px 0; padding-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>애플 등 주요 기술주가 1.2% 상승하며 기술 섹터가 강세를 보였습니다.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>전통 산업주는 0.3% 하락해, 투자자들의 관심이 기술주로 쏠린 것으로 보입니다.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>총 거래량은 124억 주로, 시장 참여 심리가 여전히 활발함을 보여줍니다.
  </li>
</ul>

<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">핵심 요약:</strong> 기술주 투자자에게는 긍정적인 하루였습니다. 새로운 진입을 고려 중이라면 기술 섹터가 좋은 출발점이 될 수 있습니다.</p>
</div>

<div style="margin: 20px 0 0 0;">
<a href="https://example.com/article1" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">전체 기사 보기 →</a>
</div>
</div>

<div style="border-top: 1px solid #374151; margin: 32px 0 24px 0;"></div>

<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 20px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">📈 상승 종목</h3>

<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FDD458; line-height: 1.4;">
애플, 예상치 상회한 실적 발표 후 주가 급등
</h4>

<ul style="margin: 16px 0 20px 0; padding-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>실적 발표 후 애플 주가는 5.2% 상승했습니다.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>다음 분기 아이폰 판매는 8% 증가할 것으로 예상됩니다.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>앱스토어 및 서비스 부문 매출은 223억 달러로 14% 증가했습니다.
  </li>
</ul>

<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">핵심 요약:</strong> 애플은 하드웨어와 서비스 모두에서 안정적인 수익을 내고 있어, 경기 변동에도 비교적 안전한 종목으로 평가됩니다.</p>
</div>

<div style="margin: 20px 0 0 0;">
<a href="https://example.com/article2" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">전체 기사 보기 →</a>
</div>
</div>`;
