import { IsNotEmpty } from 'class-validator';
import type { Grade, Ingredient } from '../../types';

export class CreateCocktailDto {
  user: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Recipe is required' })
  recipe: string;

  isPublished: boolean;

  @IsNotEmpty({ message: 'Ingredients are required' })
  ingredients: Ingredient[];

  grades: Grade[];
}
