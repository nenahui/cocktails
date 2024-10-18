import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
import { API_URL } from '@/consts';
import { selectCocktail, selectOneCocktail } from '@/features/cocktails/cocktailsSlice';
import { fetchCocktail } from '@/features/cocktails/cocktailsThunks';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export const OneCocktail: React.FC = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectCocktail);
  const oneCocktailFetching = useAppSelector(selectOneCocktail);

  useEffect(() => {
    dispatch(fetchCocktail(id));
  }, [dispatch, id]);

  if (oneCocktailFetching) {
    return <Loader fixed />;
  }

  if (!cocktail) {
    return (
      <small className={'fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 text-muted-foreground'}>
        Cocktail not found or error occurred. |
        <Link to={'/'} className={'underline hover:text-primary ml-1'}>
          Back to cocktails.
        </Link>
      </small>
    );
  }

  return (
    <>
      <div className={'flex gap-3 mb-2'}>
        <img
          className={'max-w-xs object-cover w-full h-96 rounded-xl'}
          src={`${API_URL}/${cocktail.image}`}
          alt={`${cocktail.name} image`}
        />
        <div className={'space-y-1'}>
          <h1 className={'text-xl leading-none'}>{cocktail.name}</h1>
          <p>
            Rating: 0 <small>({cocktail.grades.length} votes)</small>
          </p>

          <div>
            <h2>Ingredients:</h2>
            <ul className={'list-disc pl-8'}>
              {cocktail.ingredients.map((ingredient, index) => (
                <li className={'capitalize text-sm'} key={index}>
                  {ingredient.name} - <span className={'text-muted-foreground'}>{ingredient.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <h2>Recipe:</h2>
        <p className={'text-sm mb-2'}>{cocktail.recipe}</p>

        <div className={'flex items-center gap-2'}>
          <h4>Rate:</h4>
          <div className={'flex items-center'}>
            <SolidStarIcon className={'size-5'} />
            <SolidStarIcon className={'size-5'} />
            <SolidStarIcon className={'size-5'} />
            <StarIcon className={'size-5'} />
            <StarIcon className={'size-5'} />
          </div>
        </div>
      </div>
    </>
  );
};
