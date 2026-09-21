import { Link } from 'react-router-dom';
import type { User } from '../../types/user';
import { Button } from '../ui/Button';

type UsersTableProps = {
  users: User[];
  onDeleteRequested: (user: User) => void;
};

function ViewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m4 20 4.3-1L19 8.3a2.1 2.1 0 0 0-3-3L5.3 16 4 20Z" />
      <path d="m13.8 7.5 3 3" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5" />
    </svg>
  );
}

const actionClassName =
  'inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-primary/10 hover:text-primary';

export function UsersTable({ users, onDeleteRequested }: UsersTableProps) {
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
                    disabled
                    title="Visualização indisponível"
                    aria-label="Visualizar usuário"
                    className={actionClassName + ' cursor-not-allowed opacity-45'}
                  >
                    <ViewIcon />
                  </Button>
                  <Link
                    to={'/users/' + user.id + '/edit'}
                    title="Editar usuário"
                    aria-label="Editar usuário"
                    className={actionClassName}
                  >
                    <EditIcon />
                  </Link>
                  <Button
                    type="button"
                    title="Excluir usuário"
                    aria-label="Excluir usuário"
                    className={actionClassName + ' hover:text-danger'}
                    onClick={() => onDeleteRequested(user)}
                  >
                    <DeleteIcon />
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
