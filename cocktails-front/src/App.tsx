import { Layout } from '@/components/layout/layout';
import { Cocktails } from '@/features/cocktails/cocktails';
import { Login } from '@/features/users/login';
import { Register } from '@/features/users/register';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path={'/'} element={<Cocktails />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
      </Routes>
    </Layout>
  );
};
