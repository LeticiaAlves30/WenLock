import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { UsersTable } from '../../components/users/UsersTable';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { PageTitle } from '../../components/ui/PageTitle';
import { useDebounce } from '../../hooks/useDebounce';
import { useDeleteUser } from '../../hooks/useDeleteUser';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../types/user';
import { getApiErrorMessage, hasApiErrorStatus } from '../../utils/getApiErrorMessage';
import './UsersPage.css';

const USERS_PAGE_LIMIT = 10;
const SEARCH_DEBOUNCE_DELAY = 400;

function getSuccessMessage(state: unknown): string | undefined {
  if (typeof state !== 'object' || state === null) return undefined;
  const { successMessage } = state as { successMessage?: unknown };
  return typeof successMessage === 'string' ? successMessage : undefined;
}

export function UsersPage() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deletionMessage, setDeletionMessage] = useState<string>();
  const search = useDebounce(searchInput, SEARCH_DEBOUNCE_DELAY).trim();
  const { data, isError, isPending, refetch } = useUsers({ page, limit: USERS_PAGE_LIMIT, search });
  const deleteUser = useDeleteUser();

  useEffect(() => {
    if (!data) return;
    const nextPage = data.meta.totalPages === 0 ? 1 : Math.min(page, data.meta.totalPages);
    if (nextPage !== page) setPage(nextPage);
  }, [data, page]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setPage(1);
    setSearchInput(event.target.value);
  }

  function handleDeleteRequested(user: User) {
    setDeletionMessage(undefined);
    setUserToDelete(user);
  }

  async function handleDeleteConfirmed() {
    if (!userToDelete) return;
    try {
      await deleteUser.mutateAsync(userToDelete.id);
      setUserToDelete(null);
      setDeletionMessage('Usuário excluído com sucesso.');
    } catch (error: unknown) {
      if (hasApiErrorStatus(error, 404)) {
        setUserToDelete(null);
        setDeletionMessage('Usuário não encontrado.');
        await refetch();
        return;
      }
      setDeletionMessage(
        getApiErrorMessage(error, 'Não foi possível excluir o usuário. Tente novamente.'),
      );
    }
  }

  const successMessage = getSuccessMessage(location.state);
  return (
    <section>
      <div className="users-page__header">
        <PageTitle>Usuários</PageTitle>
        <Link to="/users/new">Novo usuário</Link>
      </div>
      {successMessage ? <p role="status">{successMessage}</p> : null}
      {deletionMessage ? <p role="alert">{deletionMessage}</p> : null}
      <div className="users-page__search">
        <label htmlFor="users-search">Pesquisar por nome</label>
        <input
          id="users-search"
          type="search"
          placeholder="Pesquisar por nome"
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>
      {isPending ? <LoadingState message="Carregando usuários..." /> : null}
      {isError ? (
        <ErrorState
          message="Não foi possível carregar os usuários."
          onRetry={() => void refetch()}
        />
      ) : null}
      {data && !isError && data.meta.total === 0 ? (
        <EmptyState
          message={
            search ? 'Nenhum usuário encontrado para a pesquisa.' : 'Nenhum usuário cadastrado.'
          }
        />
      ) : null}
      {data && !isError && data.meta.total > 0 ? (
        <>
          <UsersTable users={data.data} onDeleteRequested={handleDeleteRequested} />
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}
      <ConfirmDialog
        open={userToDelete !== null}
        title="Excluir usuário"
        description={
          userToDelete
            ? 'Tem certeza que deseja excluir ' +
              userToDelete.name +
              '? Esta ação não poderá ser desfeita.'
            : ''
        }
        confirmLabel="Excluir"
        isLoading={deleteUser.isPending}
        onCancel={() => {
          if (!deleteUser.isPending) setUserToDelete(null);
        }}
        onConfirm={() => void handleDeleteConfirmed()}
      />
    </section>
  );
}
