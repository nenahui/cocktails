import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { MainNav } from '@/components/mainNav/mainNav';
import { Button } from '@/components/ui/button';
import { NewCocktails } from '@/features/cocktails/newCocktails';
import { selectUser } from '@/features/users/usersSlice';
import { logout } from '@/features/users/usersThunks';
import { ArrowRightStartOnRectangleIcon, SquaresPlusIcon, UserIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className='sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 max-w-5xl mx-auto items-center'>
        <MainNav user={user} />
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <nav className='flex items-center gap-2'>
            {user ? (
              <Button onClick={handleLogout} size={'sm'} variant={'ghost'}>
                Logout
                <ArrowRightStartOnRectangleIcon />
              </Button>
            ) : (
              <Link to={'/login'}>
                <Button size={'sm'} variant={'ghost'}>
                  Login
                  <UserIcon />
                </Button>
              </Link>
            )}

            {user && (
              <NewCocktails>
                <Button size={'sm'}>
                  Add cocktail
                  <SquaresPlusIcon />
                </Button>
              </NewCocktails>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
