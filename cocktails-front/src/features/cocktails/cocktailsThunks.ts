import { axiosApi } from '@/axiosApi';
import type { Cocktail } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCocktails = createAsyncThunk<Cocktail[]>('cocktails/fetchCocktails', async () => {
  const { data: cocktails } = await axiosApi.get<Cocktail[]>('/cocktails');

  return cocktails;
});
