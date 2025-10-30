import type * as WatchlistTypes from './watchlist';

declare global {
  type User = {
    id: string;
    name: string;
    email: string;
  };

  type WelcomeEmailData = {
    email: string;
    name: string;
    intro: string;
  };

  type MarketNewsArticle = {
    id: number;
    headline: string;
    summary: string;
    source: string;
    url: string;
    datetime: number;
    category: string;
    related: string;
    image?: string;
  };

  type RawNewsArticle = {
    id: number;
    headline?: string;
    summary?: string;
    source?: string;
    url?: string;
    datetime?: number;
    image?: string;
    category?: string;
    related?: string;
  };

  type Stock = {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
  };

  type StockWithWatchlistStatus = Stock & {
    isInWatchlist: boolean;
  };

  type FinnhubSearchResult = {
    symbol: string;
    description: string;
    displaySymbol?: string;
    type: string;
  };

  type FinnhubSearchResponse = {
    count: number;
    result: FinnhubSearchResult[];
  };

  type Alert = {
    id: string;
    symbol: string;
    company: string;
    alertName: string;
    currentPrice: number;
    alertType: 'upper' | 'lower';
    threshold: number;
    changePercent?: number;
  };

  type SearchCommandProps = {
    renderAs?: 'button' | 'text';
    label?: string;
    initialStocks: StockWithWatchlistStatus[];
  };

  // Watchlist 타입들을 global로 선언
  type WatchlistItem = WatchlistTypes.WatchlistItem;
  type CreateWatchlistItemData = WatchlistTypes.CreateWatchlistItemData;
  type WatchlistFilter = WatchlistTypes.WatchlistFilter;
  type WatchlistResult = WatchlistTypes.WatchlistResult;
  type AddWatchlistResult = WatchlistTypes.AddWatchlistResult;
  type RemoveWatchlistResult = WatchlistTypes.RemoveWatchlistResult;
  type WatchlistStatusResult = WatchlistTypes.WatchlistStatusResult;
  type GetWatchlistResult = WatchlistTypes.GetWatchlistResult;
  type WatchlistAction = WatchlistTypes.WatchlistAction;
  type WatchlistEvent = WatchlistTypes.WatchlistEvent;
}

export {};
