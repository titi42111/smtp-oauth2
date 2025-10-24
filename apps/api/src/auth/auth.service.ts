import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    const match = await compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return user;
  }

  async createToken(userId: string, role: string) {
    const secret = process.env.JWT_SECRET || 'change-me';
    const payload = { sub: userId, role };
    return sign(payload, secret, { expiresIn: '15m' });
  }
}
