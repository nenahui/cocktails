import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { CocktailSchema } from './schemas/cocktail.schema';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { UniqueUserEmailConstraint } from './users/validators/unique-user-email.validators';
import { CocktailsController } from './cocktails/cocktails.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cocktails'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Cocktail', schema: CocktailSchema },
    ]),
    PassportModule,
  ],
  controllers: [UsersController, CocktailsController],
  providers: [AuthService, LocalStrategy, UniqueUserEmailConstraint],
})
export class AppModule {}
