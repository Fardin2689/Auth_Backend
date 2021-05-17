import { IsEmail, IsString, Matches } from 'class-validator';

export class AuthEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
