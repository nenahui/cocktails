import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import type { Model } from 'mongoose';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { User, type UserDocument } from '../schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar', { dest: './public/images' }))
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
      avatar: `images/${file.filename}`,
      password,
      googleId,
      role: 'user',
    });

    user.generateToken();

    return await user.save();
  }

  @Post('sessions')
  @UseGuards(AuthGuard('local'))
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
