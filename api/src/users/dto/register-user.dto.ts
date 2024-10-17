import { IsEmail, IsNotEmpty } from 'class-validator';
import { UniqueUserEmail } from '../validators/unique-user-email.validators';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @UniqueUserEmail({ message: 'Email already exists' })
  email: string;

  @IsNotEmpty({ message: 'Display name is required' })
  displayName: string;

  avatar: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  token: string;

  googleId: string;
}
