import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ListUsersQueryDto } from './list-users-query.dto';

async function validationErrors<T extends object>(dto: T) {
  return validate(dto);
}

describe('CreateUserDto', () => {
  const validUser = {
    name: 'Maria da Silva',
    email: 'maria@email.com',
    registration: '001234',
    password: 'abc123',
  };

  it('accepts a valid user', async () => {
    const errors = await validationErrors(plainToInstance(CreateUserDto, validUser));

    expect(errors).toHaveLength(0);
  });

  it('rejects a name containing a number', async () => {
    const errors = await validationErrors(
      plainToInstance(CreateUserDto, { ...validUser, name: 'Maria 2' }),
    );

    expect(errors).not.toHaveLength(0);
  });

  it('rejects a name containing only spaces', async () => {
    const errors = await validationErrors(
      plainToInstance(CreateUserDto, { ...validUser, name: '   ' }),
    );

    expect(errors).not.toHaveLength(0);
  });

  it('rejects an invalid email', async () => {
    const errors = await validationErrors(
      plainToInstance(CreateUserDto, { ...validUser, email: 'maria-email.com' }),
    );

    expect(errors).not.toHaveLength(0);
  });

  it('rejects a registration containing letters', async () => {
    const errors = await validationErrors(
      plainToInstance(CreateUserDto, { ...validUser, registration: '00A123' }),
    );

    expect(errors).not.toHaveLength(0);
  });

  it.each(['abc12', 'abc1234', 'abc!23'])('rejects an invalid password: %s', async (password) => {
    const errors = await validationErrors(
      plainToInstance(CreateUserDto, { ...validUser, password }),
    );

    expect(errors).not.toHaveLength(0);
  });
});

describe('ListUsersQueryDto', () => {
  it('transforms page and limit into numbers', async () => {
    const dto = plainToInstance(ListUsersQueryDto, { page: '2', limit: '25' });
    const errors = await validationErrors(dto);

    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(25);
  });

  it('rejects a page lower than one', async () => {
    const errors = await validationErrors(plainToInstance(ListUsersQueryDto, { page: '0' }));

    expect(errors).not.toHaveLength(0);
  });

  it('rejects a limit above the maximum', async () => {
    const errors = await validationErrors(plainToInstance(ListUsersQueryDto, { limit: '101' }));

    expect(errors).not.toHaveLength(0);
  });
});
