import { IsEmail, IsNotEmpty } from 'class-validator';
import { UniqueUserEmail } from '../validators/unique-user-email.validators';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Please provide a valid email' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @UniqueUserEmail({ message: 'Email already exists' })
  email: string;

  @IsNotEmpty({ message: 'Please provide a valid display name' })
  displayName: string;

  avatar: string;

  @IsNotEmpty({ message: 'Please provide a valid password' })
  password: string;

  token: string;

  googleId: string;
}
