import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usersService } from '../../services/users.service';
import { UserCreatePage } from '.';

vi.mock('../../services/users.service', () => ({
  usersService: {
    createUser: vi.fn(),
  },
}));

const createUserMock = vi.mocked(usersService.createUser);

const createdUser = {
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

function renderUserCreatePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/users/new']}>
        <Routes>
          <Route path="/users/new" element={<UserCreatePage />} />
          <Route path="/users" element={<UsersDestination />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return queryClient;
}

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria Silva' } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'Maria@Email.com' } });
  fireEvent.change(screen.getByLabelText('Matrícula'), { target: { value: '001234' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'abc123' } });
}

async function submitValidForm() {
  fillValidForm();
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeEnabled();
  });
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));
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

describe('UserCreatePage', () => {
  it('renders the user creation form', () => {
    renderUserCreatePage();

    expect(screen.getByRole('heading', { name: 'Cadastro de Usuário' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Matrícula')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('only calls the mutation after the form is valid', async () => {
    renderUserCreatePage();

    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));
    expect(createUserMock).not.toHaveBeenCalled();

    createUserMock.mockResolvedValue(createdUser);
    await submitValidForm();

    await waitFor(() => expect(createUserMock).toHaveBeenCalledTimes(1));
  });

  it('sends the normalized valid payload', async () => {
    createUserMock.mockResolvedValue(createdUser);
    renderUserCreatePage();

    await submitValidForm();

    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalledWith({
        name: 'Maria Silva',
        email: 'maria@email.com',
        registration: '001234',
        password: 'abc123',
      });
    });
  });

  it('disables submit while the mutation is pending', async () => {
    createUserMock.mockReturnValue(new Promise(() => {}));
    renderUserCreatePage();

    await submitValidForm();

    expect(await screen.findByRole('button', { name: 'Salvando...' })).toBeDisabled();
  });

  it('navigates to users with success feedback after creation', async () => {
    createUserMock.mockResolvedValue(createdUser);
    renderUserCreatePage();

    await submitValidForm();

    expect(await screen.findByRole('heading', { name: 'Usuários' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Usuário cadastrado com sucesso.');
  });

  it('invalidates the users query after creation', async () => {
    createUserMock.mockResolvedValue(createdUser);
    const queryClient = renderUserCreatePage();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    await submitValidForm();

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['users', 'list'] });
    });
  });

  it('displays an email conflict returned by the API', async () => {
    createUserMock.mockRejectedValue(createApiError(409, 'E-mail já cadastrado.'));
    renderUserCreatePage();

    await submitValidForm();

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail já cadastrado.');
  });

  it('displays a registration conflict returned by the API', async () => {
    createUserMock.mockRejectedValue(createApiError(409, 'Matrícula já cadastrada.'));
    renderUserCreatePage();

    await submitValidForm();

    expect(await screen.findByRole('alert')).toHaveTextContent('Matrícula já cadastrada.');
  });

  it('displays a generic message for an unexpected failure', async () => {
    createUserMock.mockRejectedValue(new Error('Internal database detail'));
    renderUserCreatePage();

    await submitValidForm();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível cadastrar o usuário. Tente novamente.',
    );
  });

  it('returns to users when cancellation is requested', async () => {
    renderUserCreatePage();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Deseja cancelar?');
    fireEvent.click(screen.getByRole('button', { name: 'Sim' }));

    expect(await screen.findByRole('heading', { name: 'Usuários' })).toBeInTheDocument();
  });
});
