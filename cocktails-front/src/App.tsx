import { Cocktails } from '@/features/cocktails/cocktails';
import { Login } from '@/features/users/login';
import { Register } from '@/features/users/register';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <div className={'container max-w-4xl mx-auto mt-4'}>
      <Routes>
        <Route path={'/'} element={<Cocktails />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
      </Routes>
    </div>
  );
};
