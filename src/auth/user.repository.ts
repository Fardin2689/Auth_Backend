import {
  ConflictException,
  InternalServerErrorException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthSignInDto } from './dto/auth.signin.dto';
import { AuthEmailDto } from './dto/auth.email.dto';
import { AuthResetPassDto } from './dto/auth.resetPass.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { firstName, lastName, phoneNumber, email, password } =
      authCredentialsDto;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.password = await bcrypt.hash(password, 10);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Email already exists!');
      else throw new InternalServerErrorException();
    }
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<User> {
    const { email, password } = authSignInDto;
    const user = await this.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    } else throw new UnauthorizedException('Invalid Credentials!');
  }

  async forgotPass(authEmailDto: AuthEmailDto): Promise<User> {
    const { email } = authEmailDto;
    const user = await this.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid Email!');
    return user;
  }

  async resetPass(
    authResetPassDto: AuthResetPassDto,
    user: User,
  ): Promise<void> {
    const { password, passwordConfirm } = authResetPassDto;
    if (password !== passwordConfirm)
      throw new NotAcceptableException('Passwords are noth match');

    user.password = await bcrypt.hash(password, 10);

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
