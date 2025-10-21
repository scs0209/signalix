import Image from 'next/image';
import Link from 'next/link';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import NavItems from './NavItems';
import UserAvatar from './UserAvatar';

interface HeaderProps {
  user: User;
}

const Header = async ({ user }: HeaderProps) => {
  const initialStocks = await searchStocks();

  return (
    <header className='sticky top-0 header'>
      <div className='container header-wrapper'>
        <Link href='/'>
          <Image src='/logo.png' alt='Signalix logo' width={140} height={32} className='h-8 w-auto cursor-pointer' />
        </Link>

        <nav className='hidden sm:block'>
          <NavItems initialStocks={initialStocks} />
        </nav>

        <UserAvatar user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};

export default Header;
