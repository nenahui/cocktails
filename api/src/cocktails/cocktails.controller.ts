import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import type { Model } from 'mongoose';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { UploadInterceptor } from '../interceptors/upload.interceptor';
import { Cocktail, type CocktailDocument } from '../schemas/cocktail.schema';
import type { UserDocument } from '../schemas/user.schema';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import type { RateCocktailDto } from './dto/rate-cocktails.dto';

@Controller('cocktails')
export class CocktailsController {
  constructor(
    @InjectModel(Cocktail.name) private cocktailsModel: Model<CocktailDocument>,
  ) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getAll(@Req() req: Request) {
    const user = req.user as UserDocument | undefined;

    if (user && user.role === 'admin') {
      return this.cocktailsModel.find();
    }

    return this.cocktailsModel.find({ isPublished: true });
  }

  @Get('/user/:userId')
  @UseGuards(TokenAuthGuard)
  async getUserCocktails(@Param('userId') userId: string) {
    return this.cocktailsModel.find({ user: userId });
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async getCocktail(@Param('id') id: string, @Req() req: Request) {
    const cocktail = await this.cocktailsModel.findById(id);
    if (!cocktail) {
      throw new BadRequestException('Cocktail not found');
    }

    const averageGrade = this.calculateAverageGrade(cocktail);
    const totalGrades = cocktail.grades.length;

    const user = req.user as UserDocument;
    const userGrade = user
      ? cocktail.grades.find((g) => g.user === user._id.toString())?.grade
      : null;

    return {
      cocktail,
      averageGrade,
      totalGrades,
      userGrade,
    };
  }

  @Post()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(UploadInterceptor('./public/cocktails', 'image'))
  async createCocktail(
    @Req() req: Request,
    @Body() createCocktailDto: CreateCocktailDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please provide a valid image file');
    }

    const { name, recipe, ingredients, grades } = createCocktailDto;

    const user = req.user as UserDocument;

    const cocktail = await new this.cocktailsModel({
      user: user._id,
      name,
      image: `cocktails/${file.filename}`,
      recipe,
      ingredients,
      grades,
    }).populate('user');

    return await cocktail.save();
  }

  @Patch(':id/rate')
  @UseGuards(TokenAuthGuard)
  async rateCocktail(
    @Param('id') id: string,
    @Body() rateCocktailDto: RateCocktailDto,
    @Req() req: Request,
  ) {
    const cocktail = await this.cocktailsModel.findById(id);
    if (!cocktail) {
      throw new BadRequestException('Cocktail not found');
    }

    const { grade } = rateCocktailDto;
    const user = req.user as UserDocument;

    const existingGradeIndex = cocktail.grades.findIndex(
      (g) => g.user.toString() === user._id.toString(),
    );

    if (existingGradeIndex !== -1) {
      cocktail.grades[existingGradeIndex].grade = grade;
    } else {
      cocktail.grades.push({
        user: user._id.toString(),
        grade,
      });
    }

    await cocktail.save();

    const averageGrade = this.calculateAverageGrade(cocktail);
    const totalGrades = cocktail.grades.length;

    return {
      message: 'Rating submitted successfully',
      averageGrade,
      totalGrades,
    };
  }

  @Patch(':id/publish')
  @UseGuards(TokenAuthGuard, RolesGuard)
  async publishCocktail(@Param('id') id: string) {
    const cocktail = await this.cocktailsModel.findById(id);

    if (!cocktail) {
      throw new BadRequestException('Cocktail not found');
    }

    cocktail.isPublished = true;
    await cocktail.save();

    return { message: 'Cocktail published successfully', cocktail };
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  async deleteCocktail(@Param('id') id: string) {
    await this.cocktailsModel.findByIdAndDelete(id);

    return;
  }

  private calculateAverageGrade(cocktail: CocktailDocument) {
    if (cocktail.grades.length === 0) return 0;

    const total = cocktail.grades.reduce((sum, { grade }) => sum + grade, 0);
    return total / cocktail.grades.length;
  }
}
