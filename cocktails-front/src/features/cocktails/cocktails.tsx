import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
import { selectCocktails, selectCocktailsFetching } from '@/features/cocktails/cocktailsSlice';
import { fetchCocktails } from '@/features/cocktails/cocktailsThunks';
import { CocktailsCard } from '@/features/cocktails/components/cocktailsCard/cocktailsCard';
import { NewCocktails } from '@/features/cocktails/newCocktails';
import { selectUser } from '@/features/users/usersSlice';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Cocktails: React.FC = () => {
  const user = useAppSelector(selectUser);
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
      {!user && !cocktailsFetching && cocktails.length === 0 ? (
        <small className={'text-center block mx-auto text-muted-foreground'}>
          No cocktails found. <br />
          <Link to={'/login'} className={'underline hover:text-black'}>
            Please login and add a cocktail.
          </Link>
        </small>
      ) : !cocktailsFetching && cocktails.length === 0 ? (
        <small className={'text-center block mx-auto max-w-max text-muted-foreground'}>
          No cocktails found. <br />
          <NewCocktails>
            <p className={'cursor-pointer underline hover:text-black'}>Please add a cocktail.</p>
          </NewCocktails>
        </small>
      ) : (
        <section className={'grid grid-cols-3 gap-4'}>
          {cocktails.map((cocktail) => (
            <CocktailsCard key={cocktail._id} cocktail={cocktail} />
          ))}
        </section>
      )}
    </>
  );
};
