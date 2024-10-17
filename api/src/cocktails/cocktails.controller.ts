import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Model } from 'mongoose';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { Cocktail, type CocktailDocument } from '../schemas/cocktail.schema';
import type { UserDocument } from '../schemas/user.schema';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { Request } from 'express';

@Controller('cocktails')
export class CocktailsController {
  constructor(
    @InjectModel(Cocktail.name) private cocktailsModel: Model<CocktailDocument>,
  ) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getAll(@Req() req: Request) {
    const user = req.user as UserDocument;

    if (user?.role === 'admin') {
      return this.cocktailsModel.find();
    }

    return this.cocktailsModel.find({ isPublished: true });
  }

  @Post()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
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

    const cocktail = new this.cocktailsModel({
      user: user._id,
      name,
      image: `images/${file.filename}`,
      recipe,
      ingredients,
      grades,
    });

    return await cocktail.save();
  }
}
