import {
  createCocktail,
  deleteCocktail,
  fetchCocktail,
  fetchCocktails,
  fetchMyCocktails,
  publishCocktail,
} from '@/features/cocktails/cocktailsThunks';
import type { Cocktail } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

interface CocktailsState {
  cocktails: Cocktail[];
  myCocktails: Cocktail[];
  cocktail: Cocktail | null;
  myCocktailsFetching: boolean;
  cocktailsFetching: boolean;
  cocktailsCreating: boolean;
  cocktailsDeleting: string | null;
  cocktailsPublishing: string | null;
  oneCocktailFetching: boolean;
}

const initialState: CocktailsState = {
  cocktails: [],
  myCocktails: [],
  cocktail: null,
  myCocktailsFetching: false,
  cocktailsFetching: false,
  cocktailsCreating: false,
  cocktailsDeleting: null,
  cocktailsPublishing: null,
  oneCocktailFetching: false,
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
      .addCase(createCocktail.fulfilled, (state) => {
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

    builder
      .addCase(deleteCocktail.pending, (state, { meta }) => {
        state.cocktailsDeleting = meta.arg;
      })
      .addCase(deleteCocktail.fulfilled, (state) => {
        state.cocktailsDeleting = null;
      })
      .addCase(deleteCocktail.rejected, (state) => {
        state.cocktailsDeleting = null;
      });

    builder
      .addCase(publishCocktail.pending, (state, { meta }) => {
        state.cocktailsPublishing = meta.arg;
      })
      .addCase(publishCocktail.fulfilled, (state) => {
        state.cocktailsPublishing = null;
      })
      .addCase(publishCocktail.rejected, (state) => {
        state.cocktailsPublishing = null;
      });

    builder
      .addCase(fetchCocktail.pending, (state) => {
        state.oneCocktailFetching = true;
      })
      .addCase(fetchCocktail.fulfilled, (state, { payload: cocktail }) => {
        state.cocktail = cocktail;
        state.oneCocktailFetching = false;
      })
      .addCase(fetchCocktail.rejected, (state) => {
        state.oneCocktailFetching = false;
      });
  },
  selectors: {
    selectCocktails: (state) => state.cocktails,
    selectCocktailsFetching: (state) => state.cocktailsFetching,
    selectCocktailsCreating: (state) => state.cocktailsCreating,
    selectMyCocktails: (state) => state.myCocktails,
    selectMyCocktailsFetching: (state) => state.myCocktailsFetching,
    selectCocktailsDeleting: (state) => state.cocktailsDeleting,
    selectCocktailsPublishing: (state) => state.cocktailsPublishing,
    selectCocktail: (state) => state.cocktail,
    selectOneCocktail: (state) => state.oneCocktailFetching,
  },
});

export const {
  selectCocktails,
  selectCocktailsFetching,
  selectCocktailsCreating,
  selectMyCocktailsFetching,
  selectMyCocktails,
  selectCocktailsDeleting,
  selectCocktailsPublishing,
  selectCocktail,
  selectOneCocktail,
} = cocktailsSlice.selectors;
