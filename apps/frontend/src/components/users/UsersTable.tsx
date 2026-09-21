import { Eye, PencilSimple, Trash } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import type { User } from '../../types/user';
import { Button } from '../ui/Button';

type UsersTableProps = {
  users: User[];
  onViewRequested: (user: User) => void;
  onDeleteRequested: (user: User) => void;
};

const actionClassName =
  'inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-primary/10 hover:text-primary';

export function UsersTable({ users, onDeleteRequested, onViewRequested }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left">
        <thead className="bg-sidebar text-sm font-bold text-white">
          <tr>
            <th scope="col" className="rounded-l-md px-6 py-4">
              Nome
            </th>
            <th scope="col" className="w-36 rounded-r-md px-6 py-4 text-right">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="text-sm text-content">
          {users.map((user) => (
            <tr key={user.id} className="bg-surface hover:bg-app-background/50">
              <td className="border-b border-sidebar/10 px-6 py-5 font-semibold">{user.name}</td>
              <td className="border-b border-sidebar/10 px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    title="Visualizar usuário"
                    aria-label="Visualizar usuário"
                    className={actionClassName}
                    onClick={() => onViewRequested(user)}
                  >
                    <Eye aria-hidden="true" size={19} weight="regular" />
                  </Button>
                  <Link
                    to={'/users/' + user.id + '/edit'}
                    title="Editar usuário"
                    aria-label="Editar usuário"
                    className={actionClassName}
                  >
                    <PencilSimple aria-hidden="true" size={19} weight="regular" />
                  </Link>
                  <Button
                    type="button"
                    title="Excluir usuário"
                    aria-label="Excluir usuário"
                    className={actionClassName + ' hover:text-danger'}
                    onClick={() => onDeleteRequested(user)}
                  >
                    <Trash aria-hidden="true" size={19} weight="regular" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
