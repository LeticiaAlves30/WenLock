import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import type { UsersQueryParams } from '../types/user';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (page: number, limit: number, search: string | undefined) =>
    [...usersKeys.lists(), page, limit, search] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

export function useUsers({
  page,
  limit,
  search,
}: Required<Pick<UsersQueryParams, 'page' | 'limit'>> & Pick<UsersQueryParams, 'search'>) {
  const normalizedSearch = search?.trim() || undefined;

  return useQuery({
    queryKey: usersKeys.list(page, limit, normalizedSearch),
    queryFn: () => usersService.getUsers({ page, limit, search: normalizedSearch }),
    placeholderData: keepPreviousData,
  });
}
