import { Cocktails } from '@/features/cocktails/cocktails';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <div className={'container max-w-2xl mx-auto mt-4'}>
      <Routes>
        <Route path={'/'} element={<Cocktails />} />
      </Routes>
    </div>
  );
};
