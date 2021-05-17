import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { AuthEmailDto } from './dto/auth.email.dto';
import { AuthSignInDto } from './dto/auth.signin.dto';
import { JwtPayload } from './jwtPayload.interface';
import { UserRepository } from './user.repository';
import Mailer from '../email/sendEmail';
import { AuthResetPassDto } from './dto/auth.resetPass.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userrepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userrepository.signUp(authCredentialsDto);
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
    const { email } = await this.userrepository.signIn(authSignInDto);
    const payload: JwtPayload = { email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async forgotPass(authEmailDto: AuthEmailDto): Promise<String> {
    const { email } = await this.userrepository.forgotPass(authEmailDto);

    const payload: JwtPayload = { email };
    const token = this.jwtService.sign(payload);

    const textEmail = Mailer.setMailOptions(email, token);
    const isSend = await Mailer.sendEmail(textEmail);
    console.log(isSend);

    if (!isSend) throw new ServiceUnavailableException('Try again!');
    return 'Email has been sent.';
  }

  async resetPass(
    authResetPassDto: AuthResetPassDto,
    user: User,
  ): Promise<void> {
    return this.userrepository.resetPass(authResetPassDto, user);
  }
}
