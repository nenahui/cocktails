import { cn } from '@/lib/utils';
import { BugAntIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

export const MainNav = () => {
  const { pathname } = useLocation();

  return (
    <div className='mr-4 flex'>
      <Link to='/' className='mr-4 flex items-center space-x-1'>
        <BugAntIcon className={'size-5'} />
        <span>Cocktails</span>
      </Link>
      <nav className='flex items-center gap-4 text-sm'>
        <Link
          to='/'
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Главная
        </Link>
        <Link
          to='/news'
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/news' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Мои коктейли
        </Link>
        <Link
          to='/events'
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/events' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Добавить коктейль
        </Link>
      </nav>
    </div>
  );
};
