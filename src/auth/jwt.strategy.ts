import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwtPayload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as config from 'config';

const jwtConfig = config.get('jwt');

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new UnauthorizedException();

    delete user.password;
    return user;
  }
}
