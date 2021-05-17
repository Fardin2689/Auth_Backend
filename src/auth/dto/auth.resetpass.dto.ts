import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthResetPassDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[^A-Za-z0-9])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must be strong [Aa1@] ',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[^A-Za-z0-9])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Confirmation-Password must be strong [Aa1@] ',
  })
  passwordConfirm: string;
}
