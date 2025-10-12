import Image from 'next/image';
import Link from 'next/link';
import NavItems from './NavItems';
import UserAvatar from './UserAvatar';

const Header = () => {
  return (
    <header className='sticky top-0 header'>
      <div className='container header-wrapper'>
        <Link href='/'>
          <Image src='/logo.png' alt='Signalix logo' width={140} height={32} className='h-8 w-auto cursor-pointer' />
        </Link>

        <nav className='hidden sm:block'>
          <NavItems />
        </nav>

        <UserAvatar
          user={{
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
          }}
        />
      </div>
    </header>
  );
};

export default Header;
