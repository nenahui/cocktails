import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { Grade, Ingredient } from '../types';
import { User } from './user.schema';

export type CocktailDocument = Cocktail & mongoose.Document;

@Schema()
export class Cocktail {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  recipe: string;

  @Prop({ required: true, default: false })
  isPublished: boolean;

  @Prop({ required: true })
  ingredients: Ingredient[];

  @Prop([
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      grade: { type: Number, required: true, min: 1, max: 5 },
    },
  ])
  grades: Grade[];
}

export const CocktailSchema = SchemaFactory.createForClass(Cocktail);
