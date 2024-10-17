import { useAppDispatch } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCocktail } from '@/features/cocktails/cocktailsThunks';
import type { CocktailMutation } from '@/types';
import { XCircleIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import React, { type PropsWithChildren } from 'react';
import { toast } from 'sonner';

const initialState: CocktailMutation = {
  name: '',
  image: null,
  recipe: '',
  ingredients: [{ name: '', quantity: '' }],
};

export const NewCocktails: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [cocktailMutation, setCocktailMutation] = React.useState<CocktailMutation>(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCocktailMutation((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddIngredient = () => {
    if (cocktailMutation.ingredients.length >= 8) return;
    setCocktailMutation((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '' }],
    }));
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { id, value } = e.target;
    setCocktailMutation((prev) => {
      const ingredientsCopy = [...prev.ingredients];
      ingredientsCopy[index] = { ...ingredientsCopy[index], [id]: value };

      return { ...prev, ingredients: ingredientsCopy };
    });
  };

  const handleIngredientDelete = (index: number) => {
    setCocktailMutation((prev) => {
      const ingredientsCopy = [...prev.ingredients];
      ingredientsCopy.splice(index, 1);

      return { ...prev, ingredients: ingredientsCopy };
    });
  };

  const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    const value = files && files[0] ? files[0] : null;

    setCocktailMutation((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(createCocktail(cocktailMutation));
    setIsOpen(false);
    toast.message('Your cocktail is under moderator review.', {
      description: `${dayjs(new Date()).format(`dddd, MMMM DD, YYYY [at] hh:mm A`)}`,
      className: 'border',
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setCocktailMutation(initialState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => handleOpenChange(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'gap-0 max-h-[90%]'}>
        <DialogHeader className={'pb-0'}>
          <DialogTitle>New cocktail</DialogTitle>
          <DialogDescription>Fill in the form to add a new cocktail</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className={'space-y-3 mt-2'}>
            <div>
              <Label htmlFor={'name'}>Name</Label>
              <Input
                id={'name'}
                onChange={handleInputChange}
                value={cocktailMutation.name}
                placeholder={'Enter cocktail name'}
                required
              />
            </div>

            <div className={'space-y-2'}>
              <Label>Ingredients</Label>
              {cocktailMutation.ingredients.map((ingredient, index) => (
                <div className={'flex gap-2'} key={`ingredient_${index}`}>
                  <Input
                    id={'name'}
                    onChange={(event) => handleIngredientChange(event, index)}
                    placeholder={'Ingredient name'}
                    value={ingredient.name}
                    required
                  />

                  <Input
                    id={'quantity'}
                    onChange={(event) => handleIngredientChange(event, index)}
                    placeholder={'Quantity'}
                    value={ingredient.quantity}
                    required
                  />

                  {index > 0 && (
                    <Button
                      onClick={() => handleIngredientDelete(index)}
                      type={'button'}
                      size={'icon'}
                      variant={'ghost'}
                      className={''}
                    >
                      <XCircleIcon className={'size-10'} />
                    </Button>
                  )}
                </div>
              ))}

              <Button type={'button'} onClick={handleAddIngredient} className={'max-w-max'} size={'sm'}>
                Add ingredient
              </Button>
            </div>

            <div>
              <Label htmlFor={'recipe'}>Recipe</Label>
              <Textarea
                id={'recipe'}
                value={cocktailMutation.recipe}
                onChange={handleInputChange}
                rows={3}
                placeholder={'Enter recipe'}
                className={'resize-none'}
                required
              />
            </div>

            <div>
              <Label htmlFor={'image'}>Image</Label>
              <Input onChange={handleInputImageChange} required id={'image'} type={'file'} />
            </div>

            <Button type={'submit'} size={'sm'} className={'w-full'}>
              Add new cocktail
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
