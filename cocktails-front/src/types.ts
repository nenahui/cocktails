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

export interface LoginMutation {
  email: string;
  password: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  avatar: File | null;
}

export interface User {
  _id: string;
  email: string;
  displayName: string;
  avatar: string;
  role: 'user' | 'admin';
  token: string;
  googleId?: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}
