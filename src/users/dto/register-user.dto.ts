export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export class RegisterUserDto {
  email: string;
  displayName: string;
  avatar: string;
  password: string;
  role: UserRole;
  googleId: string;
}
