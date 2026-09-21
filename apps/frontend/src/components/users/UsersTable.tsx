import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import type { User } from '../../types/user';

type UsersTableProps = {
  users: User[];
  onDeleteRequested: (id: string) => void;
};

export function UsersTable({ users, onDeleteRequested }: UsersTableProps) {
  return (
    <div className="users-table-container">
      <table>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">E-mail</th>
            <th scope="col">Matrícula</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.registration}</td>
              <td>
                <Link to={'/users/' + user.id + '/edit'}>Editar</Link>
                <Button type="button" onClick={() => onDeleteRequested(user.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
