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
import { randomUUID } from 'crypto';
import type { Model } from 'mongoose';
import { diskStorage } from 'multer';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { Cocktail, type CocktailDocument } from '../schemas/cocktail.schema';
import type { UserDocument } from '../schemas/user.schema';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { Request } from 'express';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          const uploadPath = './public/cocktails';

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath);
        },
        filename: (_req, file, callback) => {
          const uniqueName = randomUUID();
          const ext = extname(file.originalname);
          callback(null, uniqueName + ext);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Only JPG, JPEG, and PNG files are allowed',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
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
      image: `cocktails/${file.filename}`,
      recipe,
      ingredients,
      grades,
    });

    return await cocktail.save();
  }
}
