import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

type UsersServiceMock = {
  [
    K in keyof Pick<UsersService, 'create' | 'findAll' | 'findOne' | 'update' | 'remove'>
  ]: jest.Mock;
};

const userResponse = {
  id: 'c0a8012e-0123-4abc-8def-0123456789ab',
  name: 'Maria Silva',
  email: 'maria@email.com',
  registration: '001234',
  createdAt: new Date('2026-09-19T00:00:00.000Z'),
  updatedAt: new Date('2026-09-19T00:00:00.000Z'),
};

describe('UsersController', () => {
  let usersService: UsersServiceMock;
  let controller: UsersController;

  beforeEach(() => {
    usersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new UsersController(usersService as unknown as UsersService);
  });

  it('delegates user creation and returns the service result', async () => {
    const dto: CreateUserDto = {
      name: 'Maria Silva',
      email: 'maria@email.com',
      registration: '001234',
      password: 'abc123',
    };
    usersService.create.mockResolvedValue(userResponse);

    await expect(controller.create(dto)).resolves.toEqual(userResponse);
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('delegates paginated listing and returns the service result', async () => {
    const query = Object.assign(new ListUsersQueryDto(), { page: 1, limit: 10, search: 'maria' });
    const response = {
      data: [userResponse],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    usersService.findAll.mockResolvedValue(response);

    await expect(controller.findAll(query)).resolves.toEqual(response);
    expect(usersService.findAll).toHaveBeenCalledWith(query);
  });

  it('delegates lookup by id and returns the user', async () => {
    usersService.findOne.mockResolvedValue(userResponse);

    await expect(controller.findOne(userResponse.id)).resolves.toEqual(userResponse);
    expect(usersService.findOne).toHaveBeenCalledWith(userResponse.id);
  });

  it('delegates partial updates and returns the updated user', async () => {
    const dto: UpdateUserDto = { name: 'Maria Souza' };
    const response = { ...userResponse, name: 'Maria Souza' };
    usersService.update.mockResolvedValue(response);

    await expect(controller.update(userResponse.id, dto)).resolves.toEqual(response);
    expect(usersService.update).toHaveBeenCalledWith(userResponse.id, dto);
  });

  it('delegates deletion and does not return content', async () => {
    usersService.remove.mockResolvedValue(undefined);

    await expect(controller.remove(userResponse.id)).resolves.toBeUndefined();
    expect(usersService.remove).toHaveBeenCalledWith(userResponse.id);
  });
});
