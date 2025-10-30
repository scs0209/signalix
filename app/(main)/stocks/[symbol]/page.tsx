import { headers } from 'next/headers';
import TradingViewWidget from '@/components/TradingViewWidget';
import WatchlistButton from '@/components/WatchlistButton';
import { checkWatchlistStatus } from '@/lib/actions/watchlist.actions';
import { auth } from '@/lib/better-auth/auth';
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from '@/lib/constants';

interface StockDetailsPageProps {
  params: Promise<{ symbol: string }>;
}

async function getCompanyName(symbol: string): Promise<string> {
  return symbol;
}

export default async function StockDetailsPage({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  // 사용자 인증 상태 확인
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 관심종목 상태 확인 (인증된 사용자만)
  let isInWatchlist = false;
  if (session?.user?.id) {
    try {
      isInWatchlist = await checkWatchlistStatus(session.user.id, symbol.toUpperCase());
      console.log('isInWatchlist', isInWatchlist);
    } catch (error) {
      console.error('Failed to check watchlist status:', error);
      // 에러 발생 시 기본값 사용
      isInWatchlist = false;
    }
  }

  const company = await getCompanyName(symbol);

  return (
    <div className='flex min-h-screen p-4 md:p-6 lg:p-8'>
      <section className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full'>
        {/* Left column */}
        <div className='flex flex-col gap-6'>
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className='custom-chart'
            height={600}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className='custom-chart'
            height={600}
          />
        </div>

        {/* Right column */}
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <WatchlistButton
              symbol={symbol.toUpperCase()}
              company={company}
              isInWatchlist={isInWatchlist}
              userId={session?.user?.id ?? ''}
            />
          </div>

          <TradingViewWidget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}
