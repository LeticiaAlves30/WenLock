import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usersService } from '../../services/users.service';
import type { PaginatedUsersResponse, UsersQueryParams } from '../../types/user';
import { UsersPage } from '.';

vi.mock('../../services/users.service', () => ({
  usersService: {
    getUsers: vi.fn(),
  },
}));

const getUsersMock = vi.mocked(usersService.getUsers);

const user = {
  id: 'c0a8012e-0123-4abc-8def-0123456789ab',
  name: 'Maria Silva',
  email: 'maria@email.com',
  registration: '001234',
  createdAt: '2026-09-19T00:00:00.000Z',
  updatedAt: '2026-09-19T00:00:00.000Z',
};

function createResponse(overrides: Partial<PaginatedUsersResponse> = {}): PaginatedUsersResponse {
  return {
    data: [user],
    meta: { page: 1, limit: 15, total: 1, totalPages: 1 },
    ...overrides,
  };
}

function renderUsersPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/new" element={<h1>Novo usuário</h1>} />
          <Route path="/users/:id/edit" element={<h1>Editar usuário</h1>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('UsersPage', () => {
  it('displays users returned by the API', async () => {
    getUsersMock.mockResolvedValue(createResponse());

    renderUsersPage();

    expect(await screen.findByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Nome' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Ações' })).toBeInTheDocument();
  });

  it('opens the user details drawer from the view action', async () => {
    getUsersMock.mockResolvedValue(createResponse());
    renderUsersPage();

    await screen.findByText('Maria Silva');
    fireEvent.click(screen.getByRole('button', { name: 'Visualizar usuário' }));

    const drawer = screen.getByRole('dialog', { name: 'Visualizar Usuário' });
    expect(drawer).toHaveTextContent('maria@email.com');
    expect(drawer).toHaveTextContent('001234');

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog', { name: 'Visualizar Usuário' })).not.toBeInTheDocument();
  });

  it('displays a loading state', () => {
    getUsersMock.mockReturnValue(new Promise(() => {}));

    renderUsersPage();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando usuários...');
  });

  it('displays an empty state when there are no users', async () => {
    getUsersMock.mockResolvedValue(
      createResponse({
        data: [],
        meta: { page: 1, limit: 15, total: 0, totalPages: 0 },
      }),
    );

    renderUsersPage();

    expect(await screen.findByText('Nenhum Usuário Registrado')).toBeInTheDocument();
  });

  it('displays the supplied illustration when a search has no results', async () => {
    getUsersMock.mockImplementation(async (params?: UsersQueryParams) =>
      createResponse({
        data: [],
        meta: { page: params?.page ?? 1, limit: 15, total: 0, totalPages: 0 },
      }),
    );
    renderUsersPage();

    fireEvent.change(screen.getByPlaceholderText('Pesquisar por nome'), {
      target: { value: 'inexistente' },
    });

    expect(await screen.findByText('Nenhum Resultado Encontrado')).toBeInTheDocument();
    expect(screen.getByAltText('Ilustração de nenhum resultado encontrado')).toBeInTheDocument();
  });

  it('displays an error state when loading fails', async () => {
    getUsersMock.mockRejectedValue(new Error('Request failed'));

    renderUsersPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os usuários.',
    );
  });

  it('sends the search after debounce', async () => {
    getUsersMock.mockResolvedValue(createResponse());
    renderUsersPage();
    await screen.findByText('Maria Silva');

    fireEvent.change(screen.getByPlaceholderText('Pesquisar por nome'), {
      target: { value: 'maria' },
    });

    await waitFor(
      () => {
        expect(getUsersMock).toHaveBeenLastCalledWith({ page: 1, limit: 15, search: 'maria' });
      },
      { timeout: 600 },
    );
  });

  it('resets pagination to page one when the search changes', async () => {
    getUsersMock.mockImplementation(async (params?: UsersQueryParams) =>
      createResponse({
        meta: {
          page: params?.page ?? 1,
          limit: 15,
          total: 20,
          totalPages: 2,
        },
      }),
    );
    renderUsersPage();
    await screen.findByText('Maria Silva');

    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }));
    await waitFor(() => {
      expect(getUsersMock).toHaveBeenLastCalledWith({ page: 2, limit: 15, search: undefined });
    });

    fireEvent.change(screen.getByPlaceholderText('Pesquisar por nome'), {
      target: { value: 'maria' },
    });

    await waitFor(
      () => {
        expect(getUsersMock).toHaveBeenLastCalledWith({ page: 1, limit: 15, search: 'maria' });
      },
      { timeout: 600 },
    );
  });

  it('requests the next page and disables previous navigation on the first page', async () => {
    getUsersMock.mockImplementation(async (params?: UsersQueryParams) =>
      createResponse({
        meta: {
          page: params?.page ?? 1,
          limit: 15,
          total: 20,
          totalPages: 2,
        },
      }),
    );
    renderUsersPage();
    await screen.findByText('Maria Silva');

    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }));

    await waitFor(() => {
      expect(getUsersMock).toHaveBeenLastCalledWith({ page: 2, limit: 15, search: undefined });
    });
  });

  it('navigates to creation and edition routes', async () => {
    getUsersMock.mockResolvedValue(createResponse());
    renderUsersPage();
    await screen.findByText('Maria Silva');

    fireEvent.click(screen.getByRole('link', { name: '+ Cadastrar Usuário' }));
    expect(await screen.findByRole('heading', { name: 'Novo usuário' })).toBeInTheDocument();

    cleanup();
    renderUsersPage();
    await screen.findByText('Maria Silva');
    fireEvent.click(screen.getByRole('link', { name: 'Editar usuário' }));

    expect(await screen.findByRole('heading', { name: 'Editar usuário' })).toBeInTheDocument();
  });
});
