import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
import { selectCocktails, selectCocktailsFetching } from '@/features/cocktails/cocktailsSlice';
import { fetchCocktails } from '@/features/cocktails/cocktailsThunks';
import { CocktailsCard } from '@/features/cocktails/components/cocktailsCard/cocktailsCard';
import React, { useEffect } from 'react';

export const Cocktails: React.FC = () => {
  const dispatch = useAppDispatch();
  const cocktails = useAppSelector(selectCocktails);
  const cocktailsFetching = useAppSelector(selectCocktailsFetching);

  useEffect(() => {
    dispatch(fetchCocktails());
  }, [dispatch]);

  if (cocktailsFetching) {
    return <Loader fixed />;
  }

  return (
    <>
      <section className={'grid grid-cols-3 gap-4'}>
        {cocktails.map((cocktail) => (
          <CocktailsCard key={cocktail._id} cocktail={cocktail} />
        ))}
      </section>
    </>
  );
};
