import { IsInt, Min, Max } from 'class-validator';

export class RateCocktailDto {
  @IsInt()
  @Min(1)
  @Max(5)
  grade: number;
}
