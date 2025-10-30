'use client';
import { useMemo, useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  userId: string;
  isInWatchlist: boolean;
  showTrashIcon?: boolean;
  type?: 'button' | 'icon';
}

const WatchlistButton = ({
  symbol,
  company,
  userId,
  isInWatchlist,
  showTrashIcon = false,
  type = 'button',
}: WatchlistButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, addOptimistic] = useOptimistic(isInWatchlist, (current, _) => !current);

  const label = useMemo(() => {
    if (type === 'icon') return optimisticState ? '' : '';
    return optimisticState ? 'Remove from Watchlist' : 'Add to Watchlist';
  }, [optimisticState, type]);

  const handleClick = () => {
    if (isPending) return;

    startTransition(async () => {
      // Optimistic update
      addOptimistic(undefined);

      try {
        if (optimisticState) {
          // Remove from watchlist - Server Action 직접 호출
          const success = await removeFromWatchlist(userId, symbol);

          if (!success) {
            toast.error('Failed to remove from watchlist');
            return;
          }

          toast.success('Removed from watchlist');
        } else {
          // Add to watchlist - Server Action 직접 호출
          await addToWatchlist(userId, symbol, company);
          toast.success('Added to watchlist');
        }
      } catch (error: any) {
        console.error('Watchlist operation failed:', error);
        toast.error(error.message || 'Network error. Please try again.');
      }
    });
  };

  if (type === 'icon') {
    return (
      <button
        type='button'
        title={optimisticState ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={optimisticState ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${optimisticState ? 'watchlist-icon-added' : ''} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleClick}
        disabled={isPending}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill={optimisticState ? '#FACC15' : 'none'}
          stroke='#FACC15'
          strokeWidth='1.5'
          className='watchlist-star'
        >
          <title>{optimisticState ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}</title>
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
    <button
      type='button'
      className={`watchlist-btn ${optimisticState ? 'watchlist-remove' : ''} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
      disabled={isPending}
    >
      {showTrashIcon && optimisticState ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5 mr-2'
        >
          <title>{optimisticState ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}</title>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6'
          />
        </svg>
      ) : null}
      <span>{isPending ? 'Loading...' : label}</span>
    </button>
  );
};

export default WatchlistButton;
