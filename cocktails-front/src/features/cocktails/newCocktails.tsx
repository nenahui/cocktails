import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Loader } from '@/components/loader/loader';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { selectCocktailsCreating } from '@/features/cocktails/cocktailsSlice';
import { createCocktail, fetchCocktails, fetchMyCocktails } from '@/features/cocktails/cocktailsThunks';
import { selectUser } from '@/features/users/usersSlice';
import type { CocktailMutation } from '@/types';
import { XCircleIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const initialState: CocktailMutation = {
  name: '',
  image: null,
  recipe: '',
  ingredients: [{ name: '', quantity: '' }],
};

export const NewCocktails: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useAppSelector(selectUser);
  const { pathname: path } = useLocation();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [cocktailMutation, setCocktailMutation] = React.useState<CocktailMutation>(initialState);
  const cocktailsCreating = useAppSelector(selectCocktailsCreating);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCocktailMutation((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddIngredient = () => {
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
    await dispatch(createCocktail(cocktailMutation)).unwrap();

    if (path === '/' && user && user.role === 'admin') {
      await dispatch(fetchCocktails());
    } else if (path === '/my-cocktails' && user) {
      await dispatch(fetchMyCocktails(user._id));
    }

    setIsOpen(false);
    toast.message(
      user?.role === 'user' ? 'Your cocktail is under moderator review.' : 'Cocktail successfully created.',
      {
        description: `${dayjs(new Date()).format('dddd, MMMM DD, YYYY [at] hh:mm A')}`,
        className: 'border',
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setCocktailMutation(initialState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => handleOpenChange(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'gap-0'} ref={contentRef}>
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
              {cocktailMutation.ingredients.map(
                (ingredient, index) =>
                  index < 8 && (
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
                  )
              )}

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

            <Button disabled={cocktailsCreating} type={'submit'} size={'sm'} className={'w-full'}>
              Add new cocktail {cocktailsCreating && <Loader />}
            </Button>
          </div>

          {cocktailMutation.ingredients.length > 8 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.1,
              }}
              className={'bg-background p-3 pr-1 rounded-md absolute w-full left-[32vw] top-0'}
            >
              <ScrollArea className={'pr-3'} style={{ height: `calc(${contentRef?.current?.offsetHeight}px - 25px)` }}>
                <div className={'flex flex-col gap-2'}>
                  {cocktailMutation.ingredients.map(
                    (ingredient, index) =>
                      index >= 8 && (
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
                      )
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
