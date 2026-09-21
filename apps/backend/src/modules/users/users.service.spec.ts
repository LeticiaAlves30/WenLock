import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UserPublic } from './users.types';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const hashMock = bcrypt.hash as jest.MockedFunction<
  (data: string, saltOrRounds: number) => Promise<string>
>;

const user: UserPublic = {
  id: 'c0a8012e-0123-4abc-8def-0123456789ab',
  name: 'Maria Silva',
  email: 'maria@email.com',
  registration: '001234',
  createdAt: new Date('2026-09-19T00:00:00.000Z'),
  updatedAt: new Date('2026-09-19T00:00:00.000Z'),
};

type UsersRepositoryMock = {
  [
    K in keyof Pick<
      UsersRepository,
      | 'findAll'
      | 'count'
      | 'findById'
      | 'findByEmail'
      | 'findByRegistration'
      | 'create'
      | 'update'
      | 'delete'
    >
  ]: jest.Mock;
};

describe('UsersService', () => {
  let repository: UsersRepositoryMock;
  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = {
      findAll: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByRegistration: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new UsersService(repository as unknown as UsersRepository);
    hashMock.mockResolvedValue('$2b$10$hashed-password');
  });

  describe('create', () => {
    const dto: CreateUserDto = {
      name: '  Maria Silva  ',
      email: '  Maria@Email.com  ',
      registration: '  001234  ',
      password: 'abc123',
    };

    it('creates a valid user with normalized data and a password hash', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.findByRegistration.mockResolvedValue(null);
      repository.create.mockResolvedValue(user);

      await expect(service.create(dto)).resolves.toEqual(user);

      expect(hashMock).toHaveBeenCalledWith('abc123', 10);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Maria Silva',
        email: 'maria@email.com',
        registration: '001234',
        passwordHash: '$2b$10$hashed-password',
      });
    });

    it('never sends the plain password to the repository', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.findByRegistration.mockResolvedValue(null);
      repository.create.mockResolvedValue(user);

      await service.create(dto);

      expect(repository.create.mock.calls[0][0]).not.toHaveProperty('password');
    });

    it('rejects a duplicate email', async () => {
      repository.findByEmail.mockResolvedValue(user);

      await expect(service.create(dto)).rejects.toThrow(
        new ConflictException('E-mail já cadastrado'),
      );
      expect(repository.findByRegistration).not.toHaveBeenCalled();
    });

    it('rejects a duplicate registration', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.findByRegistration.mockResolvedValue(user);

      await expect(service.create(dto)).rejects.toThrow(
        new ConflictException('Matrícula já cadastrada'),
      );
    });

    it('maps a unique constraint race condition to ConflictException', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.findByRegistration.mockResolvedValue(null);
      repository.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed.', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await expect(service.create(dto)).rejects.toThrow(
        new ConflictException('E-mail ou matrícula já cadastrado'),
      );
    });
  });

  describe('findAll', () => {
    it('returns paginated users and calculates total pages', async () => {
      repository.findAll.mockResolvedValue([user]);
      repository.count.mockResolvedValue(35);
      const query = Object.assign(new ListUsersQueryDto(), { page: 2, limit: 10, search: 'maria' });

      await expect(service.findAll(query)).resolves.toEqual({
        data: [user],
        meta: { page: 2, limit: 10, total: 35, totalPages: 4 },
      });

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(repository.count).toHaveBeenCalledWith('maria');
    });

    it('returns zero total pages for an empty result', async () => {
      repository.findAll.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);
      const query = Object.assign(new ListUsersQueryDto(), { page: 1, limit: 10 });

      await expect(service.findAll(query)).resolves.toEqual({
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
    });
  });

  describe('findOne', () => {
    it('returns an existing user', async () => {
      repository.findById.mockResolvedValue(user);

      await expect(service.findOne(user.id)).resolves.toEqual(user);
    });

    it('throws NotFoundException for a missing user', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(user.id)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
    });
  });

  describe('update', () => {
    it('updates an existing user without changing the password when it is absent', async () => {
      repository.findById.mockResolvedValue(user);
      repository.update.mockResolvedValue({ ...user, name: 'Maria Souza' });

      await service.update(user.id, { name: '  Maria Souza  ' } as UpdateUserDto);

      expect(hashMock).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(user.id, { name: 'Maria Souza' });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(user.id, { name: 'Maria Souza' })).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
    });

    it('rejects an email used by another user', async () => {
      repository.findById.mockResolvedValue(user);
      repository.findByEmail.mockResolvedValue({ ...user, id: 'another-user' });

      await expect(service.update(user.id, { email: 'other@email.com' })).rejects.toThrow(
        new ConflictException('E-mail já cadastrado'),
      );
    });

    it('rejects a registration used by another user', async () => {
      repository.findById.mockResolvedValue(user);
      repository.findByRegistration.mockResolvedValue({ ...user, id: 'another-user' });

      await expect(service.update(user.id, { registration: '009999' })).rejects.toThrow(
        new ConflictException('Matrícula já cadastrada'),
      );
    });

    it('generates a new hash when a password is sent', async () => {
      repository.findById.mockResolvedValue(user);
      repository.update.mockResolvedValue(user);

      await service.update(user.id, { password: 'abc456' });

      expect(hashMock).toHaveBeenCalledWith('abc456', 10);
      expect(repository.update).toHaveBeenCalledWith(user.id, {
        passwordHash: '$2b$10$hashed-password',
      });
    });

    it('does not check for conflict when normalized credentials belong to the same user', async () => {
      repository.findById.mockResolvedValue(user);

      await expect(
        service.update(user.id, {
          email: ' MARIA@EMAIL.COM ',
          registration: '001234',
        }),
      ).resolves.toEqual(user);

      expect(repository.findByEmail).not.toHaveBeenCalled();
      expect(repository.findByRegistration).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes an existing user', async () => {
      repository.findById.mockResolvedValue(user);
      repository.delete.mockResolvedValue(undefined);

      await expect(service.remove(user.id)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(user.id);
    });

    it('throws NotFoundException when the user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(user.id)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
