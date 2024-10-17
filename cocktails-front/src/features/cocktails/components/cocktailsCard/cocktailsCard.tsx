import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/consts';
import { selectCocktailsDeleting } from '@/features/cocktails/cocktailsSlice';
import { deleteCocktail, fetchCocktails, fetchMyCocktails } from '@/features/cocktails/cocktailsThunks';
import { selectUser } from '@/features/users/usersSlice';
import type { Cocktail } from '@/types';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface Props {
  cocktail: Cocktail;
}

export const CocktailsCard: React.FC<Props> = ({ cocktail }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { pathname: path } = useLocation();
  const cocktailsDeleting = useAppSelector(selectCocktailsDeleting);

  const handleDelete = async () => {
    await dispatch(deleteCocktail(cocktail._id)).unwrap();
    if (path === '/') {
      await dispatch(fetchCocktails());
    } else if (path === '/my-cocktails' && user) {
      await dispatch(fetchMyCocktails(user._id));
    }

    toast.message(`Cocktail ${cocktail.name} successfully removed.`, {
      description: `${dayjs(new Date()).format('dddd, MMMM DD, YYYY [at] hh:mm A')}`,
      className: 'border',
    });
  };

  return (
    <Card className={'shadow-none border-0 h-full w-full p-4 rounded-2xl relative'}>
      <div className={`${cocktailsDeleting === cocktail._id && 'opacity-10'}`}>
        <div className={'bg-muted rounded-2xl'}>
          <img
            src={`${API_URL}/${cocktail.image}`}
            alt={`${cocktail.name} image`}
            className={'rounded-2xl w-full aspect-square object-cover mb-3'}
          />
        </div>

        {!cocktail.isPublished && (
          <Button
            size={'icon'}
            className={'bg-muted hover:bg-gray-200 border shadow-none absolute top-2 left-2 rounded-xl'}
          >
            <ClockIcon className={'text-black'} />
          </Button>
        )}

        {user && user.role === 'admin' && (
          <Button
            onClick={handleDelete}
            size={'icon'}
            className={`absolute top-2 left-12 ${cocktail.isPublished && 'left-2'} rounded-xl`}
          >
            <TrashIcon />
          </Button>
        )}

        <div>
          <CardTitle className={'font-medium'}>{cocktail.name}</CardTitle>
          <CardDescription className={'line-clamp-2'}>{cocktail.recipe}</CardDescription>
        </div>
      </div>

      {cocktailsDeleting === cocktail._id && <Loader absolute />}
    </Card>
  );
};
