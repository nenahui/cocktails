import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import type { Model } from 'mongoose';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { UploadInterceptor } from '../interceptors/upload.interceptor';
import { User, type UserDocument } from '../schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  @UseInterceptors(UploadInterceptor('./public/avatars', 'avatar'))
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please provide a valid avatar file');
    }

    const { email, displayName, password, googleId } = registerUserDto;

    const user = new this.userModel({
      email,
      displayName,
      avatar: `avatars/${file.filename}`,
      password,
      googleId,
      role: 'user',
    });

    user.generateToken();

    return await user.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: Request) {
    return req.user;
  }

  @Delete('logout')
  @UseGuards(TokenAuthGuard)
  async logout(@Req() req: Request) {
    const user = req.user as UserDocument;
    user.generateToken();

    await user.save();

    return;
  }
}
