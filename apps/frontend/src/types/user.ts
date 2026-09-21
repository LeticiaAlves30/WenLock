export interface User {
  id: string;
  name: string;
  email: string;
  registration: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  registration: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  registration?: string;
  password?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedUsersResponse {
  data: User[];
  meta: PaginationMeta;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
