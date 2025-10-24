import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { email: 'asc' },
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        lastLoginAt: true
      }
    });
  }

  async create(data: CreateUserDto) {
    const passwordHash = await hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        email: data.email,
        role: data.role,
        passwordHash,
        enabled: true
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });
  }
}
