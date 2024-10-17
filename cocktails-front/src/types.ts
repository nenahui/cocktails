export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Grade {
  user: string;
  grade: number;
}

export interface Cocktail {
  _id: number;
  user: string;
  name: string;
  image: string;
  recipe: string;
  isPublished: boolean;
  grades: Grade[];
}
