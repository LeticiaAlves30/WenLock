import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { usersKeys } from './useUsers';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: async (_result, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: usersKeys.lists() }),
        queryClient.removeQueries({ queryKey: usersKeys.detail(id) }),
      ]);
    },
  });
}
