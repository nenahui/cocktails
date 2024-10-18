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
  async getCocktail(@Param('id') id: string) {
    return this.cocktailsModel.findById(id);
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
}
