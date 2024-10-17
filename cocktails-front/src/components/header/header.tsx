import { MainNav } from '@/components/mainNav/mainNav';
import { Button } from '@/components/ui/button';
import { SquaresPlusIcon, UserIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 max-w-5xl mx-auto items-center'>
        <MainNav />
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <nav className='flex items-center gap-2'>
            <Link to={'/login'}>
              <Button size={'sm'} variant={'ghost'}>
                Войти
                <UserIcon />
              </Button>
            </Link>

            <Link to={'/'}>
              <Button size={'sm'}>
                Добавить коктейль
                <SquaresPlusIcon />
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
