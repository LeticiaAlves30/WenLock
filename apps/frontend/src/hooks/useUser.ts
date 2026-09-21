import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { userDetailQueryKey } from './useUsers';

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userDetailQueryKey(id ?? ''),
    queryFn: async () => {
      if (!id) {
        throw new Error('User id is required.');
      }

      return usersService.getUserById(id);
    },
    enabled: Boolean(id),
  });
}
