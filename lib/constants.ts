export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/search', label: 'Search' },
];

// 📊 TradingView Widgets Configurations
// 각 상수는 TradingView의 임베디드 위젯(Embedded Widget)을 위한 설정값입니다.

// 🧩 1. Market Overview Widget
// 섹터별 주요 주식의 미니차트를 탭 형태로 보여주는 위젯
// https://www.tradingview.com/widget/market-overview/
export const MARKET_OVERVIEW_WIDGET_CONFIG = {
  colorTheme: 'dark', // 다크 모드
  dateRange: '12M', // 최근 12개월 차트
  locale: 'en', // 언어
  largeChartUrl: '', // 큰 차트로 이동할 URL (선택)
  isTransparent: true, // 배경 투명
  showFloatingTooltip: true, // 호버 시 툴팁 표시
  plotLineColorGrowing: '#0FEDBE', // 상승 시 라인 색상
  plotLineColorFalling: '#0FEDBE', // 하락 시 라인 색상
  gridLineColor: 'rgba(240, 243, 250, 0)', // 그리드 라인 색상 (투명)
  scaleFontColor: '#DBDBDB', // 폰트 색상
  belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)', // 상승 시 영역 색상
  belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)', // 하락 시 영역 색상
  belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
  belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
  symbolActiveColor: 'rgba(15, 237, 190, 0.05)', // 활성 심볼 하이라이트 색상
  tabs: [
    {
      title: 'Financial',
      symbols: [
        { s: 'NYSE:JPM', d: 'JPMorgan Chase' },
        { s: 'NYSE:WFC', d: 'Wells Fargo Co New' },
        { s: 'NYSE:BAC', d: 'Bank Amer Corp' },
        { s: 'NYSE:HSBC', d: 'Hsbc Hldgs Plc' },
        { s: 'NYSE:C', d: 'Citigroup Inc' },
        { s: 'NYSE:MA', d: 'Mastercard Incorporated' },
      ],
    },
    {
      title: 'Technology',
      symbols: [
        { s: 'NASDAQ:AAPL', d: 'Apple' },
        { s: 'NASDAQ:GOOGL', d: 'Alphabet' },
        { s: 'NASDAQ:MSFT', d: 'Microsoft' },
        { s: 'NASDAQ:FB', d: 'Meta Platforms' },
        { s: 'NYSE:ORCL', d: 'Oracle Corp' },
        { s: 'NASDAQ:INTC', d: 'Intel Corp' },
      ],
    },
    {
      title: 'Services',
      symbols: [
        { s: 'NASDAQ:AMZN', d: 'Amazon' },
        { s: 'NYSE:BABA', d: 'Alibaba Group Hldg Ltd' },
        { s: 'NYSE:T', d: 'At&t Inc' },
        { s: 'NYSE:WMT', d: 'Walmart' },
        { s: 'NYSE:V', d: 'Visa' },
      ],
    },
  ],
  support_host: 'https://www.tradingview.com', // TradingView 호스트
  backgroundColor: '#141414', // 배경색
  width: '100%', // 전체 너비
  height: 600, // 높이(px)
  showSymbolLogo: true, // 심볼 로고 표시
  showChart: true, // 미니 차트 표시
};

// 🧩 2. Heatmap Widget
// 시장 섹터별 등락률을 시각화하는 히트맵 위젯
// https://www.tradingview.com/widget/heatmap/
export const HEATMAP_WIDGET_CONFIG = {
  dataSource: 'SPX500', // 기준 지수 (S&P500)
  blockSize: 'market_cap_basic', // 블록 크기 기준: 시가총액
  blockColor: 'change', // 색상 기준: 등락률
  grouping: 'sector', // 그룹화 기준: 섹터
  isTransparent: true,
  locale: 'en',
  symbolUrl: '',
  colorTheme: 'dark',
  exchanges: [],
  hasTopBar: false,
  isDataSetEnabled: false,
  isZoomEnabled: true, // 줌 가능
  hasSymbolTooltip: true, // 호버 시 심볼 툴팁 표시
  isMonoSize: false,
  width: '100%',
  height: '600',
};

// 🧩 3. Top Stories (News) Widget
// 실시간 주식시장 뉴스 피드를 표시하는 위젯
// https://www.tradingview.com/widget/news/
export const TOP_STORIES_WIDGET_CONFIG = {
  displayMode: 'regular', // 일반 모드
  feedMode: 'market', // 마켓 관련 뉴스
  colorTheme: 'dark',
  isTransparent: true,
  locale: 'en',
  market: 'stock', // 주식 시장 뉴스
  width: '100%',
  height: '600',
};

// 🧩 4. Market Data Widget
// 실시간 시세 데이터를 테이블 형태로 보여주는 위젯
// https://www.tradingview.com/widget/market-data/
export const MARKET_DATA_WIDGET_CONFIG = {
  title: 'Stocks',
  width: '100%',
  height: 600,
  locale: 'en',
  showSymbolLogo: true, // 심볼 로고 표시
  colorTheme: 'dark',
  isTransparent: false,
  backgroundColor: '#0F0F0F',
  symbolsGroups: [
    {
      name: 'Financial',
      symbols: [
        { name: 'NYSE:JPM', displayName: 'JPMorgan Chase' },
        { name: 'NYSE:WFC', displayName: 'Wells Fargo Co New' },
        { name: 'NYSE:BAC', displayName: 'Bank Amer Corp' },
        { name: 'NYSE:HSBC', displayName: 'Hsbc Hldgs Plc' },
        { name: 'NYSE:C', displayName: 'Citigroup Inc' },
        { name: 'NYSE:MA', displayName: 'Mastercard Incorporated' },
      ],
    },
    {
      name: 'Technology',
      symbols: [
        { name: 'NASDAQ:AAPL', displayName: 'Apple' },
        { name: 'NASDAQ:GOOGL', displayName: 'Alphabet' },
        { name: 'NASDAQ:MSFT', displayName: 'Microsoft' },
        { name: 'NASDAQ:FB', displayName: 'Meta Platforms' },
        { name: 'NYSE:ORCL', displayName: 'Oracle Corp' },
        { name: 'NASDAQ:INTC', displayName: 'Intel Corp' },
      ],
    },
    {
      name: 'Services',
      symbols: [
        { name: 'NASDAQ:AMZN', displayName: 'Amazon' },
        { name: 'NYSE:BABA', displayName: 'Alibaba Group Hldg Ltd' },
        { name: 'NYSE:T', displayName: 'At&t Inc' },
        { name: 'NYSE:WMT', displayName: 'Walmart' },
        { name: 'NYSE:V', displayName: 'Visa' },
      ],
    },
  ],
};
