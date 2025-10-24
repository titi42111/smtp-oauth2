import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole as PrismaUserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: PrismaUserRole })
  @IsEnum(PrismaUserRole)
  role!: PrismaUserRole;

  @ApiProperty()
  @IsString()
  @MinLength(12)
  password!: string;
}

export type UserRole = PrismaUserRole;
