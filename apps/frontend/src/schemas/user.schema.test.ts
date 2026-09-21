import { describe, expect, it } from 'vitest';
import { createUserSchema } from './user.schema';

const validUser = {
  name: 'Maria da Silva',
  email: 'Maria@Email.com',
  registration: '001234',
  password: 'abc123',
};

describe('createUserSchema', () => {
  it('accepts and normalizes valid input', () => {
    const result = createUserSchema.safeParse(validUser);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('maria@email.com');
      expect(result.data.registration).toBe('001234');
    }
  });

  it('rejects a name containing only spaces', () => {
    expect(createUserSchema.safeParse({ ...validUser, name: '   ' }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(createUserSchema.safeParse({ ...validUser, email: 'maria-email.com' }).success).toBe(
      false,
    );
  });

  it('rejects a registration containing letters', () => {
    expect(createUserSchema.safeParse({ ...validUser, registration: '00A123' }).success).toBe(
      false,
    );
  });

  it('rejects an invalid password', () => {
    expect(createUserSchema.safeParse({ ...validUser, password: 'abc!23' }).success).toBe(false);
  });
});
