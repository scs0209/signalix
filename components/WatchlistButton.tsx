'use client';
import React, { useMemo, useState } from 'react';

// 주석 한국어로 작성
// 최소한의 WatchlistButton 구현을 충족하기 위한 컴포넌트입니다.
// 이 컴포넌트는 UI 계약만 중점으로 합니다. 로컬 상태를 토글하고
// onWatchlistChange가 제공되면 호출합니다. 스타일링 훅은 globals.css와 일치합니다.
interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
  showTrashIcon?: boolean;
  type?: 'button' | 'icon';
  onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
}

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = 'button',
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);

  const label = useMemo(() => {
    if (type === 'icon') return added ? '' : '';
    return added ? 'Remove from Watchlist' : 'Add to Watchlist';
  }, [added, type]);

  const handleClick = () => {
    const next = !added;
    setAdded(next);
    onWatchlistChange?.(symbol, next);
  };

  if (type === 'icon') {
    return (
      <button
        type='button'
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${added ? 'watchlist-icon-added' : ''}`}
        onClick={handleClick}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill={added ? '#FACC15' : 'none'}
          stroke='#FACC15'
          strokeWidth='1.5'
          className='watchlist-star'
        >
          <title>{added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}</title>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z'
          />
        </svg>
      </button>
    );
  }

  return (
    <button type='button' className={`watchlist-btn ${added ? 'watchlist-remove' : ''}`} onClick={handleClick}>
      {showTrashIcon && added ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5 mr-2'
        >
          <title>{added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}</title>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6'
          />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;
