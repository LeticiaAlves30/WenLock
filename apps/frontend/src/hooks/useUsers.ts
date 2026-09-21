import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import type { UsersQueryParams } from '../types/user';

export const usersQueryKey = ['users'] as const;
export const userDetailQueryKey = (id: string) => [...usersQueryKey, 'detail', id] as const;

export function useUsers({ page, limit, search }: Required<Pick<UsersQueryParams, 'page' | 'limit'>> &
  Pick<UsersQueryParams, 'search'>) {
  const normalizedSearch = search?.trim() || undefined;

  return useQuery({
    queryKey: [...usersQueryKey, page, limit, normalizedSearch],
    queryFn: () => usersService.getUsers({ page, limit, search: normalizedSearch }),
    placeholderData: keepPreviousData,
  });
}
