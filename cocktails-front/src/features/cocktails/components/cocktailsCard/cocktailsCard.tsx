import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/consts';
import type { Cocktail } from '@/types';
import React from 'react';

interface Props {
  cocktail: Cocktail;
}

export const CocktailsCard: React.FC<Props> = ({ cocktail }) => {
  return (
    <Card className={'shadow-none border-0 w-full p-4 rounded-2xl'}>
      <div className={'bg-muted rounded-2xl'}>
        <img
          src={`${API_URL}/${cocktail.image}`}
          alt={`${cocktail.name} image`}
          className={'rounded-2xl w-full aspect-square object-cover mb-3'}
        />
      </div>

      <div>
        <CardTitle className={'font-medium'}>{cocktail.name}</CardTitle>
        <CardDescription className={'line-clamp-2'}>{cocktail.recipe}</CardDescription>
      </div>
    </Card>
  );
};
