import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateUserData,
  FindUsersOptions,
  UpdateUserData,
  UserPublic,
  userPublicSelect,
} from './users.types';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ page, limit, search }: FindUsersOptions): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      where: this.createSearchFilter(search),
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      select: userPublicSelect,
    });
  }

  count(search?: string): Promise<number> {
    return this.prisma.user.count({ where: this.createSearchFilter(search) });
  }

  findById(id: string): Promise<UserPublic | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  findByEmail(email: string): Promise<UserPublic | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: userPublicSelect,
    });
  }

  findByRegistration(registration: string): Promise<UserPublic | null> {
    return this.prisma.user.findUnique({
      where: { registration },
      select: userPublicSelect,
    });
  }

  create(data: CreateUserData): Promise<UserPublic> {
    return this.prisma.user.create({
      data,
      select: userPublicSelect,
    });
  }

  update(id: string, data: UpdateUserData): Promise<UserPublic> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: userPublicSelect,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
      select: { id: true },
    });
  }

  private createSearchFilter(search?: string): Prisma.UserWhereInput {
    if (!search) {
      return {};
    }

    return {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };
  }
}
