import { useAppSelector } from '@/app/hooks';
import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/protectedRoute/protectedRoute';
import { Toaster } from '@/components/ui/sonner';
import { Cocktails } from '@/features/cocktails/cocktails';
import { MyCocktails } from '@/features/cocktails/myCocktails';
import { Login } from '@/features/users/login';
import { Register } from '@/features/users/register';
import { selectUser } from '@/features/users/usersSlice';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const App: React.FC = () => {
  const user = useAppSelector(selectUser);

  return (
    <Layout>
      <Toaster />
      <Routes>
        <Route path={'/'} element={<Cocktails />} />
        <Route
          path={'/my-cocktails'}
          element={
            <ProtectedRoute isAllowed={!!user} status={403} text={'Unauthorized!'}>
              <MyCocktails />
            </ProtectedRoute>
          }
        />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
        <Route
          path={'*'}
          element={
            <span
              className={
                'text-nowrap text-muted-foreground text-sm fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4'
              }
            >
              404 | Not Found
            </span>
          }
        />
      </Routes>
    </Layout>
  );
};
