import type {
  CreateUserInput,
  PaginatedUsersResponse,
  UpdateUserInput,
  User,
  UsersQueryParams,
} from '../types/user';
import { api } from './api';

export const usersService = {
  async getUsers(params?: UsersQueryParams): Promise<PaginatedUsersResponse> {
    const response = await api.get<PaginatedUsersResponse>('/users', { params });
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>('/users/' + id);
    return response.data;
  },

  async createUser(input: CreateUserInput): Promise<User> {
    const response = await api.post<User>('/users', input);
    return response.data;
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const response = await api.patch<User>('/users/' + id, input);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete('/users/' + id);
  },
};
