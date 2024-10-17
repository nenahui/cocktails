import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/consts';
import type { Cocktail } from '@/types';
import React from 'react';

interface Props {
  cocktail: Cocktail;
}

export const CocktailsCard: React.FC<Props> = ({ cocktail }) => {
  return (
    <Card className={'shadow-none'}>
      <img src={`${API_URL}/${cocktail.image}`} alt={`${cocktail.name} image`} />

      <CardContent className={'border-t pt-2 pb-2 px-4'}>
        <CardTitle>{cocktail.name}</CardTitle>
        <CardDescription>{cocktail.recipe}</CardDescription>
      </CardContent>
    </Card>
  );
};
