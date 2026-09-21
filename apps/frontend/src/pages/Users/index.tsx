import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { UsersTable } from '../../components/users/UsersTable';
import { Pagination } from '../../components/ui/Pagination';
import { PageTitle } from '../../components/ui/PageTitle';
import { useDebounce } from '../../hooks/useDebounce';
import { useUsers } from '../../hooks/useUsers';
import './UsersPage.css';

const USERS_PAGE_LIMIT = 10;
const SEARCH_DEBOUNCE_DELAY = 400;

function getSuccessMessage(state: unknown): string | undefined {
  if (typeof state !== 'object' || state === null) {
    return undefined;
  }

  const { successMessage } = state as { successMessage?: unknown };
  return typeof successMessage === 'string' ? successMessage : undefined;
}

export function UsersPage() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_DELAY);
  const search = debouncedSearch.trim();
  const { data, isError, isPending, refetch } = useUsers({
    page,
    limit: USERS_PAGE_LIMIT,
    search,
  });

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setPage(1);
    setSearchInput(event.target.value);
  }

  function handleDeleteRequested(): void {
    // The deletion flow is added in a subsequent feature commit.
  }

  return (
    <section>
      <div className="users-page__header">
        <PageTitle>Usuários</PageTitle>
        <Link to="/users/new">Novo usuário</Link>
      </div>

      {getSuccessMessage(location.state) ? (
        <p role="status">{getSuccessMessage(location.state)}</p>
      ) : null}

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
        <ErrorState message="Não foi possível carregar os usuários." onRetry={() => void refetch()} />
      ) : null}
      {data && !isError && data.meta.total === 0 ? (
        <EmptyState
          message={
            search
              ? 'Nenhum usuário encontrado para a pesquisa.'
              : 'Nenhum usuário cadastrado.'
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
    </section>
  );
}
