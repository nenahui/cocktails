import { fetchCocktails } from '@/features/cocktails/cocktailsThunks';
import type { Cocktail } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

interface CocktailsState {
  cocktails: Cocktail[];
  cocktailsFetching: boolean;
}

const initialState: CocktailsState = {
  cocktails: [],
  cocktailsFetching: false,
};

export const cocktailsSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCocktails.pending, (state) => {
        state.cocktailsFetching = true;
      })
      .addCase(fetchCocktails.fulfilled, (state, { payload: cocktails }) => {
        state.cocktails = cocktails;
        state.cocktailsFetching = false;
      })
      .addCase(fetchCocktails.rejected, (state) => {
        state.cocktailsFetching = false;
      });
  },
  selectors: {
    selectCocktails: (state: CocktailsState) => state.cocktails,
    selectCocktailsFetching: (state: CocktailsState) => state.cocktailsFetching,
  },
});

export const { selectCocktails, selectCocktailsFetching } = cocktailsSlice.selectors;
