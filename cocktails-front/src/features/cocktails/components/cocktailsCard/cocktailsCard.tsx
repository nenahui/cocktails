import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { API_URL } from '@/consts';
import { selectCocktailsDeleting, selectCocktailsPublishing } from '@/features/cocktails/cocktailsSlice';
import {
  deleteCocktail,
  fetchCocktails,
  fetchMyCocktails,
  publishCocktail,
} from '@/features/cocktails/cocktailsThunks';
import { selectUser } from '@/features/users/usersSlice';
import type { Cocktail } from '@/types';
import { CheckBadgeIcon, ClockIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PopoverClose } from '@radix-ui/react-popover';
import dayjs from 'dayjs';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  cocktail: Cocktail;
}

export const CocktailsCard: React.FC<Props> = ({ cocktail }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { pathname: path } = useLocation();
  const cocktailsDeleting = useAppSelector(selectCocktailsDeleting);
  const cocktailsPublishing = useAppSelector(selectCocktailsPublishing);

  const startFetchCocktails = async () => {
    if (path === '/') {
      await dispatch(fetchCocktails());
    } else if (path === '/my-cocktails' && user) {
      await dispatch(fetchMyCocktails(user._id));
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteCocktail(cocktail._id)).unwrap();
    void startFetchCocktails();

    toast.message(`Cocktail ${cocktail.name} successfully removed.`, {
      description: `${dayjs(new Date()).format('dddd, MMMM DD, YYYY [at] hh:mm A')}`,
      className: 'border',
    });
  };

  const handlePublish = async () => {
    await dispatch(publishCocktail(cocktail._id)).unwrap();
    void startFetchCocktails();

    toast.message(`Cocktail ${cocktail.name} successfully published.`, {
      description: `${dayjs(new Date()).format('dddd, MMMM DD, YYYY [at] hh:mm A')}`,
      className: 'border',
    });
  };

  return (
    <Card className={'shadow-none border-0 h-full w-full p-4 rounded-2xl relative'}>
      <div
        className={`${cocktailsDeleting === cocktail._id && 'opacity-10'} ${cocktailsPublishing === cocktail._id && 'opacity-10'}`}
      >
        <div className={'bg-muted rounded-2xl'}>
          <img
            src={`${API_URL}/${cocktail.image}`}
            alt={`${cocktail.name} image`}
            className={'rounded-2xl w-full aspect-square object-cover mb-3'}
          />
        </div>

        {user?.role === 'admin' && !cocktail.isPublished ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size={'icon'}
                className={'bg-muted hover:bg-gray-200 border shadow-none absolute top-2 left-2 rounded-xl'}
              >
                <ClockIcon className={'text-black'} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={'max-w-max space-x-1 p-2'}>
              <small className={'block text-center mb-1'}>Do you want to publish?</small>
              <div className={'flex gap-1'}>
                <PopoverClose asChild>
                  <Button size={'sm'} variant={'outline'}>
                    Cancel
                    <XMarkIcon />
                  </Button>
                </PopoverClose>
                <PopoverClose asChild>
                  <Button onClick={handlePublish} size={'sm'}>
                    Publish <CheckBadgeIcon />
                  </Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <TooltipProvider>
            <Tooltip delayDuration={1}>
              <TooltipTrigger asChild>
                <Button
                  size={'icon'}
                  className={'bg-muted hover:bg-gray-200 border shadow-none absolute top-2 left-2 rounded-xl'}
                >
                  <ClockIcon className={'text-black'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={'bottom'} className={'bg-muted text-black border shadow-xl'}>
                <small className={'block text-center'}>Cocktail is under review</small>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {user && user.role === 'admin' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button size={'icon'} className={`absolute top-2 left-12 ${cocktail.isPublished && 'left-2'} rounded-xl`}>
                <TrashIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={'max-w-max space-x-1 p-2'}>
              <small className={'block text-center mb-1'}>Do you really want to delete?</small>
              <div className={'flex gap-1'}>
                <PopoverClose asChild>
                  <Button size={'sm'} variant={'outline'}>
                    Cancel
                    <XMarkIcon />
                  </Button>
                </PopoverClose>
                <PopoverClose asChild>
                  <Button onClick={handleDelete} size={'sm'}>
                    Delete <TrashIcon />
                  </Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <div>
          <CardTitle className={'font-medium'}>{cocktail.name}</CardTitle>
          <CardDescription className={'line-clamp-2'}>{cocktail.recipe}</CardDescription>
        </div>
      </div>

      {cocktailsDeleting === cocktail._id && <Loader absolute />}
      {cocktailsPublishing === cocktail._id && <Loader absolute />}
    </Card>
  );
};
