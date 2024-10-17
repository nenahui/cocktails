import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
import { selectMyCocktails, selectMyCocktailsFetching } from '@/features/cocktails/cocktailsSlice';
import { fetchMyCocktails } from '@/features/cocktails/cocktailsThunks';
import { CocktailsCard } from '@/features/cocktails/components/cocktailsCard/cocktailsCard';
import { selectUser } from '@/features/users/usersSlice';
import React, { useEffect } from 'react';

export const MyCocktails: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const myCocktails = useAppSelector(selectMyCocktails);
  const myCocktailsFetching = useAppSelector(selectMyCocktailsFetching);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyCocktails(user._id));
    }
  }, [dispatch, user]);

  if (myCocktailsFetching) {
    return <Loader fixed />;
  }

  return (
    <>
      {!myCocktailsFetching && myCocktails.length === 0 ? (
        <small className={'text-center block mx-auto text-muted-foreground'}>
          No cocktails found. <br />
          Please add a cocktail.
        </small>
      ) : (
        <section className={'grid grid-cols-3 gap-4'}>
          {myCocktails.map((cocktail) => (
            <CocktailsCard key={cocktail._id} cocktail={cocktail} />
          ))}
        </section>
      )}
    </>
  );
};
