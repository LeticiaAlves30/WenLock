import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import type { UpdateUserInput } from '../types/user';
import { usersKeys } from './useUsers';

type UpdateUserVariables = {
  id: string;
  data: UpdateUserInput;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserVariables) => usersService.updateUser(id, data),
    onSuccess: async (_user, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: usersKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) }),
      ]);
    },
  });
}
