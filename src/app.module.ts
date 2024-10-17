import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { UniqueUserEmailConstraint } from './users/validators/unique-user-email.validators';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cocktails'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
  ],
  controllers: [UsersController],
  providers: [AuthService, LocalStrategy, UniqueUserEmailConstraint],
})
export class AppModule {}
