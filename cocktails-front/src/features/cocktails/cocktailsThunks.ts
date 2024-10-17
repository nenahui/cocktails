import { axiosApi } from '@/axiosApi';
import type { Cocktail, CocktailMutation, Ingredient } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCocktails = createAsyncThunk<Cocktail[]>('cocktails/fetchCocktails', async () => {
  const { data: cocktails } = await axiosApi.get<Cocktail[]>('/cocktails');

  return cocktails;
});

export const fetchMyCocktails = createAsyncThunk<Cocktail[], string>(
  'cocktails/fetchMyCocktails',
  async (id: string) => {
    const { data: cocktails } = await axiosApi.get<Cocktail[]>(`/cocktails/user/${id}`);

    return cocktails;
  }
);

export const createCocktail = createAsyncThunk<Cocktail, CocktailMutation>(
  'cocktails/createCocktail',
  async (cocktailMutation) => {
    const formData = new FormData();

    Object.entries(cocktailMutation).forEach(([key, value]) => {
      if (key === 'ingredients') {
        (value as Ingredient[]).forEach((ingredient, index) => {
          formData.append(`ingredients[${index}][name]`, ingredient.name);
          formData.append(`ingredients[${index}][amount]`, ingredient.quantity);
        });
      } else if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'string') {
        formData.append(key, value);
      }
    });

    const { data: cocktail } = await axiosApi.post<Cocktail>('/cocktails', formData);

    return cocktail;
  }
);

export const deleteCocktail = createAsyncThunk<void, string>('cocktails/deleteCocktail', async (id: string) => {
  await axiosApi.delete(`/cocktails/${id}`);
});
