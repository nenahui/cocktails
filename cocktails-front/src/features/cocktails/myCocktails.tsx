import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
import { selectMyCocktails, selectMyCocktailsFetching } from '@/features/cocktails/cocktailsSlice';
import { fetchMyCocktails } from '@/features/cocktails/cocktailsThunks';
import { CocktailsCard } from '@/features/cocktails/components/cocktailsCard/cocktailsCard';
import { selectUser } from '@/features/users/usersSlice';
import { AnimatePresence, motion } from 'framer-motion';
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
          <AnimatePresence>
            {myCocktails.map((cocktail, index) => (
              <motion.div
                key={cocktail._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.1,
                  delay: index * 0.1,
                }}
              >
                <CocktailsCard cocktail={cocktail} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      )}
    </>
  );
};
