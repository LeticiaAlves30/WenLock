import { Prisma } from '@prisma/client';

export const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  registration: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserPublic = Prisma.UserGetPayload<{ select: typeof userPublicSelect }>;

export type CreateUserData = {
  name: string;
  email: string;
  registration: string;
  passwordHash: string;
};

export type UpdateUserData = Partial<CreateUserData>;

export type FindUsersOptions = {
  page: number;
  limit: number;
  search?: string;
};
