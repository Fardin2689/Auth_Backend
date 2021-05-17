import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { AuthSignInDto } from './dto/auth.signin.dto';
import { AuthEmailDto } from './dto/auth.email.dto';
import { GetUser } from './getUser.decorator';
import { User } from './user.entity';
import { AuthResetPassDto } from './dto/auth.resetPass.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  signIn(
    @Body(ValidationPipe) authSignInDto: AuthSignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authSignInDto);
  }

  @Post('forgotpassword')
  forgotPass(
    @Body(ValidationPipe) authEmailDto: AuthEmailDto,
  ): Promise<String> {
    return this.authService.forgotPass(authEmailDto);
  }

  @Post('resetpassword')
  @UseGuards(AuthGuard())
  resetPass(
    @Body(ValidationPipe) authResetPassDto: AuthResetPassDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.resetPass(authResetPassDto, user);
  }

  @Get('session')
  @UseGuards(AuthGuard())
  session(@GetUser() user: User): User {
    return user;
  }

  @Get('test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user.firstName, ' send a request');
  }
}
