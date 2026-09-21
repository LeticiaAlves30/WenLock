import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { usersKeys } from './useUsers';

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: usersKeys.detail(id ?? ''),
    queryFn: async () => {
      if (!id) {
        throw new Error('User id is required.');
      }

      return usersService.getUserById(id);
    },
    enabled: Boolean(id),
  });
}
