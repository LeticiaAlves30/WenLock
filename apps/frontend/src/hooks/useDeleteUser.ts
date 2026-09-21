import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { userDetailQueryKey, usersQueryKey } from './useUsers';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: async (_result, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: usersQueryKey }),
        queryClient.removeQueries({ queryKey: userDetailQueryKey(id) }),
      ]);
    },
  });
}
