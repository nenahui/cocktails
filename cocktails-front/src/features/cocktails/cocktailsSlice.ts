import { createCocktail, fetchCocktails, fetchMyCocktails } from '@/features/cocktails/cocktailsThunks';
import type { Cocktail } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

interface CocktailsState {
  cocktails: Cocktail[];
  myCocktails: Cocktail[];
  myCocktailsFetching: boolean;
  cocktailsFetching: boolean;
  cocktailsCreating: boolean;
}

const initialState: CocktailsState = {
  cocktails: [],
  myCocktails: [],
  myCocktailsFetching: false,
  cocktailsFetching: false,
  cocktailsCreating: false,
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

    builder
      .addCase(createCocktail.pending, (state) => {
        state.cocktailsCreating = true;
      })
      .addCase(createCocktail.fulfilled, (state, { payload: cocktail }) => {
        if (cocktail.isPublished) {
          state.cocktails.push(cocktail);
        } else if (!cocktail.isPublished) {
          state.myCocktails.push(cocktail);
        }

        state.cocktailsCreating = false;
      })
      .addCase(createCocktail.rejected, (state) => {
        state.cocktailsCreating = false;
      });

    builder
      .addCase(fetchMyCocktails.pending, (state) => {
        state.myCocktailsFetching = true;
      })
      .addCase(fetchMyCocktails.fulfilled, (state, { payload: cocktails }) => {
        state.myCocktails = cocktails;
        state.myCocktailsFetching = false;
      })
      .addCase(fetchMyCocktails.rejected, (state) => {
        state.myCocktailsFetching = false;
      });
  },
  selectors: {
    selectCocktails: (state) => state.cocktails,
    selectCocktailsFetching: (state) => state.cocktailsFetching,
    selectCocktailsCreating: (state) => state.cocktailsCreating,
    selectMyCocktails: (state) => state.myCocktails,
    selectMyCocktailsFetching: (state) => state.myCocktailsFetching,
  },
});

export const {
  selectCocktails,
  selectCocktailsFetching,
  selectCocktailsCreating,
  selectMyCocktailsFetching,
  selectMyCocktails,
} = cocktailsSlice.selectors;
