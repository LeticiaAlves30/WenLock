import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usersService } from '../../services/users.service';
import { UserEditPage } from '.';

vi.mock('../../services/users.service', () => ({
  usersService: {
    getUserById: vi.fn(),
    updateUser: vi.fn(),
  },
}));

const getUserByIdMock = vi.mocked(usersService.getUserById);
const updateUserMock = vi.mocked(usersService.updateUser);

const user = {
  id: 'c0a8012e-0123-4abc-8def-0123456789ab',
  name: 'Maria Silva',
  email: 'maria@email.com',
  registration: '001234',
  createdAt: '2026-09-19T00:00:00.000Z',
  updatedAt: '2026-09-19T00:00:00.000Z',
};

function UsersDestination() {
  const location = useLocation();
  const successMessage =
    typeof location.state === 'object' && location.state !== null
      ? (location.state as { successMessage?: unknown }).successMessage
      : undefined;

  return (
    <section>
      <h1>Usuários</h1>
      {typeof successMessage === 'string' ? <p role="status">{successMessage}</p> : null}
    </section>
  );
}

function renderUserEditPage(id = user.id) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/users/' + id + '/edit']}>
        <Routes>
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path="/users" element={<UsersDestination />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return queryClient;
}

async function waitForForm() {
  await screen.findByRole('heading', { name: 'Editar usuário' });
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
  });
}

async function submitForm() {
  fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await waitFor(() => expect(updateUserMock).toHaveBeenCalledTimes(1));
}

function createApiError(status: number, message: string) {
  return Object.assign(new Error(message), {
    isAxiosError: true,
    response: { status, data: { message } },
  });
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('UserEditPage', () => {
  it('shows loading while the user is being fetched', () => {
    getUserByIdMock.mockReturnValue(new Promise(() => {}));
    renderUserEditPage();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando usuário...');
  });

  it('loads the user using the route id', async () => {
    getUserByIdMock.mockResolvedValue(user);
    renderUserEditPage();

    await waitForForm();

    expect(getUserByIdMock).toHaveBeenCalledWith(user.id);
  });

  it('fills the form with the loaded user and keeps password empty', async () => {
    getUserByIdMock.mockResolvedValue(user);
    renderUserEditPage();

    await waitForForm();

    expect(screen.getByLabelText('Nome')).toHaveValue('Maria Silva');
    expect(screen.getByLabelText('E-mail')).toHaveValue('maria@email.com');
    expect(screen.getByLabelText('Matrícula')).toHaveValue('001234');
    expect(screen.getByLabelText('Senha')).toHaveValue('');
  });

  it('sends the edited fields without an empty password', async () => {
    getUserByIdMock.mockResolvedValue(user);
    updateUserMock.mockResolvedValue(user);
    renderUserEditPage();

    await waitForForm();
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria Souza' } });
    await submitForm();

    expect(updateUserMock).toHaveBeenCalledWith(user.id, {
      name: 'Maria Souza',
      email: 'maria@email.com',
      registration: '001234',
    });
  });

  it('sends a valid replacement password when it is provided', async () => {
    getUserByIdMock.mockResolvedValue(user);
    updateUserMock.mockResolvedValue(user);
    renderUserEditPage();

    await waitForForm();
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'abc456' } });
    await submitForm();

    expect(updateUserMock).toHaveBeenCalledWith(user.id, {
      name: 'Maria Silva',
      email: 'maria@email.com',
      registration: '001234',
      password: 'abc456',
    });
  });

  it('navigates to users with success feedback after updating', async () => {
    getUserByIdMock.mockResolvedValue(user);
    updateUserMock.mockResolvedValue(user);
    renderUserEditPage();

    await waitForForm();
    await submitForm();

    expect(await screen.findByRole('heading', { name: 'Usuários' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Usuário atualizado com sucesso.');
  });

  it('invalidates only the users list and updated detail after success', async () => {
    getUserByIdMock.mockResolvedValue(user);
    updateUserMock.mockResolvedValue(user);
    const queryClient = renderUserEditPage();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    await waitForForm();
    await submitForm();

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['users'] });
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['users', 'detail', user.id],
      });
    });
  });

  it('shows a specific message when loading returns 404', async () => {
    getUserByIdMock.mockRejectedValue(createApiError(404, 'Not found'));
    renderUserEditPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('Usuário não encontrado.');
  });

  it('shows a specific message when updating returns 404', async () => {
    getUserByIdMock.mockResolvedValue(user);
    updateUserMock.mockRejectedValue(createApiError(404, 'Not found'));
    renderUserEditPage();

    await waitForForm();
    await submitForm();

    expect(await screen.findByRole('alert')).toHaveTextContent('Usuário não encontrado.');
  });

  it('shows an email conflict returned by the API', async () => {
    getUserByIdMock.mockResolvedValue(user);
    updateUserMock.mockRejectedValue(createApiError(409, 'E-mail já cadastrado.'));
    renderUserEditPage();

    await waitForForm();
    await submitForm();

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail já cadastrado.');
  });

  it('shows a registration conflict returned by the API', async () => {
    getUserByIdMock.mockResolvedValue(user);
    updateUserMock.mockRejectedValue(createApiError(409, 'Matrícula já cadastrada.'));
    renderUserEditPage();

    await waitForForm();
    await submitForm();

    expect(await screen.findByRole('alert')).toHaveTextContent('Matrícula já cadastrada.');
  });

  it('returns to users without making a request when cancelled', async () => {
    getUserByIdMock.mockResolvedValue(user);
    renderUserEditPage();

    await waitForForm();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(await screen.findByRole('heading', { name: 'Usuários' })).toBeInTheDocument();
    expect(updateUserMock).not.toHaveBeenCalled();
  });
});
