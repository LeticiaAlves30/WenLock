import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { Toast } from '../../components/feedback/Toast';
import { UsersTable } from '../../components/users/UsersTable';
import { UserDetailsDrawer } from '../../components/users/UserDetailsDrawer';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { PageTitle } from '../../components/ui/PageTitle';
import { useDebounce } from '../../hooks/useDebounce';
import { useDeleteUser } from '../../hooks/useDeleteUser';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../types/user';
import { getApiErrorMessage, hasApiErrorStatus } from '../../utils/getApiErrorMessage';

const USERS_PAGE_LIMIT = 15;
const SEARCH_DEBOUNCE_DELAY = 400;

function getSuccessMessage(state: unknown): string | undefined {
  if (typeof state !== 'object' || state === null) {
    return undefined;
  }

  const { successMessage } = state as { successMessage?: unknown };
  return typeof successMessage === 'string' ? successMessage : undefined;
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function UsersPage() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToView, setUserToView] = useState<User | null>(null);
  const [deletionError, setDeletionError] = useState<string>();
  const [notificationMessage, setNotificationMessage] = useState<string>();
  const search = useDebounce(searchInput, SEARCH_DEBOUNCE_DELAY).trim();
  const { data, isError, isPending, refetch } = useUsers({
    page,
    limit: USERS_PAGE_LIMIT,
    search,
  });
  const deleteUser = useDeleteUser();

  useEffect(() => {
    if (!data) {
      return;
    }

    const nextPage = data.meta.totalPages === 0 ? 1 : Math.min(page, data.meta.totalPages);

    if (nextPage !== page) {
      setPage(nextPage);
    }
  }, [data, page]);

  const successMessage = getSuccessMessage(location.state);

  useEffect(() => {
    if (successMessage) {
      setNotificationMessage(successMessage);
    }
  }, [successMessage]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setPage(1);
    setSearchInput(event.target.value);
  }

  function handleDeleteRequested(user: User) {
    setDeletionError(undefined);
    setUserToDelete(user);
  }

  async function handleDeleteConfirmed() {
    if (!userToDelete) {
      return;
    }

    try {
      await deleteUser.mutateAsync(userToDelete.id);
      setUserToDelete(null);
      setNotificationMessage('Usuário excluído com sucesso.');
    } catch (error: unknown) {
      if (hasApiErrorStatus(error, 404)) {
        setUserToDelete(null);
        setDeletionError('Usuário não encontrado.');
        await refetch();
        return;
      }

      setDeletionError(
        getApiErrorMessage(error, 'Não foi possível excluir o usuário. Tente novamente.'),
      );
    }
  }

  const isEmpty = data?.meta.total === 0;

  return (
    <section className="space-y-6 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-heading">
      <PageTitle>Usuários</PageTitle>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <label htmlFor="users-search" className="sr-only">
            Pesquisar por nome
          </label>
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted">
            <span className="size-5">
              <SearchIcon />
            </span>
          </span>
          <input
            id="users-search"
            type="search"
            placeholder="Pesquisar por nome"
            value={searchInput}
            onChange={handleSearchChange}
            className="h-11 w-full rounded-md border border-sidebar/15 bg-surface py-2 pr-4 pl-11 text-sm text-content placeholder:text-muted"
          />
        </div>
        <Link
          to="/users/new"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
        >
          + Cadastrar Usuário
        </Link>
      </div>

      {deletionError ? (
        <p role="alert" className="text-sm text-danger">
          {deletionError}
        </p>
      ) : null}
      {notificationMessage ? (
        <Toast message={notificationMessage} onDismiss={() => setNotificationMessage(undefined)} />
      ) : null}

      <div className="surface-card overflow-hidden">
        {isPending ? (
          <div className="flex min-h-72 items-center justify-center">
            <LoadingState message="Carregando usuários..." />
          </div>
        ) : null}
        {isError ? (
          <div className="flex min-h-72 items-center justify-center p-6">
            <ErrorState
              message="Não foi possível carregar os usuários."
              onRetry={() => void refetch()}
            />
          </div>
        ) : null}
        {data && !isError && isEmpty ? (
          <>
            <EmptyState
              title={search ? 'Nenhum Usuário Encontrado' : 'Nenhum Usuário Registrado'}
              message={
                search
                  ? 'Não encontramos usuários para esta pesquisa.'
                  : 'Utilize o botão Cadastrar Usuário para adicionar o primeiro usuário.'
              }
            />
            <Pagination
              page={data.meta.page}
              total={data.meta.total}
              limit={data.meta.limit}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
        {data && !isError && !isEmpty ? (
          <>
            <UsersTable
              users={data.data}
              onDeleteRequested={handleDeleteRequested}
              onViewRequested={setUserToView}
            />
            <Pagination
              page={data.meta.page}
              total={data.meta.total}
              limit={data.meta.limit}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

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
        loadingLabel="Excluindo..."
        onCancel={() => {
          if (!deleteUser.isPending) {
            setUserToDelete(null);
          }
        }}
        onConfirm={() => void handleDeleteConfirmed()}
      />
      <UserDetailsDrawer user={userToView} onClose={() => setUserToView(null)} />
    </section>
  );
}
