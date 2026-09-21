import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersListResponseDto } from './dto/users-list-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PASSWORD_SALT_ROUNDS } from './users.constants';
import { CreateUserData, UpdateUserData, UserPublic } from './users.types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const data = this.normalizeCreateData(dto);

    await this.ensureEmailIsAvailable(data.email);
    await this.ensureRegistrationIsAvailable(data.registration);

    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);

    try {
      return await this.usersRepository.create({ ...data, passwordHash });
    } catch (error) {
      this.throwIfUniqueConstraintError(error);
      throw error;
    }
  }

  async findAll(query: ListUsersQueryDto): Promise<UsersListResponseDto> {
    const [data, total] = await Promise.all([
      this.usersRepository.findAll(query),
      this.usersRepository.count(query.search),
    ]);

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    return this.getExistingUser(id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const currentUser = await this.getExistingUser(id);
    const data = await this.normalizeUpdateData(dto, currentUser);

    if (Object.keys(data).length === 0) {
      return currentUser;
    }

    try {
      return await this.usersRepository.update(id, data);
    } catch (error) {
      this.throwIfUniqueConstraintError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.getExistingUser(id);
    await this.usersRepository.delete(id);
  }

  private normalizeCreateData(dto: CreateUserDto): Omit<CreateUserData, 'passwordHash'> {
    return {
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      registration: dto.registration.trim(),
    };
  }

  private async normalizeUpdateData(
    dto: UpdateUserDto,
    currentUser: UserPublic,
  ): Promise<UpdateUserData> {
    const data: UpdateUserData = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();
      if (email !== currentUser.email) {
        await this.ensureEmailIsAvailable(email, currentUser.id);
        data.email = email;
      }
    }

    if (dto.registration !== undefined) {
      const registration = dto.registration.trim();
      if (registration !== currentUser.registration) {
        await this.ensureRegistrationIsAvailable(registration, currentUser.id);
        data.registration = registration;
      }
    }

    if (dto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);
    }

    return data;
  }

  private async getExistingUser(id: string): Promise<UserPublic> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  private async ensureEmailIsAvailable(email: string, currentUserId?: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (user && user.id !== currentUserId) {
      throw new ConflictException('E-mail já cadastrado');
    }
  }

  private async ensureRegistrationIsAvailable(
    registration: string,
    currentUserId?: string,
  ): Promise<void> {
    const user = await this.usersRepository.findByRegistration(registration);
    if (user && user.id !== currentUserId) {
      throw new ConflictException('Matrícula já cadastrada');
    }
  }

  private throwIfUniqueConstraintError(error: unknown): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('E-mail ou matrícula já cadastrado');
    }
  }
}
