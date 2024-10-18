import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
import { API_URL } from '@/consts';
import { selectCocktail, selectOneCocktail } from '@/features/cocktails/cocktailsSlice';
import { fetchCocktail, rateCocktail } from '@/features/cocktails/cocktailsThunks';
import { selectUser } from '@/features/users/usersSlice';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const OneCocktail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectCocktail);
  const oneCocktailFetching = useAppSelector(selectOneCocktail);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCocktail(id));
  }, [dispatch, id]);

  useEffect(() => {
    setUserRating(null);
    if (cocktail && cocktail.cocktail.grades) {
      const userGrade = cocktail.cocktail.grades.find((grade) => grade.user === user?._id);
      if (userGrade) {
        setUserRating(userGrade.grade);
      }
    }
  }, [cocktail, user?._id]);

  const handleRating = async (grade: number) => {
    if (!user) {
      return toast.warning('You can`t', {
        description: 'You must be logged in to rate cocktails.',
        className: 'border',
        action: {
          label: 'Login',
          onClick: () => navigate('/login'),
        },
      });
    }
    if (!cocktail?.cocktail.isPublished) {
      return toast.warning('You can`t', {
        description: 'You can rate only published cocktails.',
        className: 'border',
      });
    }
    if (userRating === grade) {
      return;
    } else {
      setUserRating(grade);
      await dispatch(rateCocktail({ cocktailId: id, grade })).unwrap();
      dispatch(fetchCocktail(id));
    }
  };

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
          src={`${API_URL}/${cocktail.cocktail.image}`}
          alt={`${cocktail.cocktail.name} image`}
        />
        <div className={'space-y-1'}>
          <h1 className={'text-xl leading-none'}>{cocktail.cocktail.name}</h1>
          <p>
            Rating: {cocktail.averageGrade.toFixed(1)} <small>({cocktail.cocktail.grades.length} votes)</small>
          </p>

          <div>
            <h2>Ingredients:</h2>
            <ul className={'list-disc pl-8'}>
              {cocktail.cocktail.ingredients.map((ingredient, index) => (
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
        <p className={'text-sm mb-2'}>{cocktail.cocktail.recipe}</p>

        <div className={'flex items-center gap-2'}>
          <h4>Rate:</h4>
          <div className={'flex items-center gap-0.5'}>
            {[1, 2, 3, 4, 5].map((grade) => (
              <button key={grade} onClick={() => handleRating(grade)} className={'flex items-center gap-1'}>
                {userRating && grade <= userRating ? (
                  <SolidStarIcon className={'h-6 text-primary'} />
                ) : (
                  <StarIcon className={'h-6'} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
