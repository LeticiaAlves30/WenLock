import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usersService } from '../../services/users.service';
import { UsersPage } from '.';

vi.mock('../../services/users.service', () => ({ usersService: { getUsers: vi.fn(), deleteUser: vi.fn() } }));

const getUsersMock = vi.mocked(usersService.getUsers);
const deleteUserMock = vi.mocked(usersService.deleteUser);
const user = { id: 'c0a8012e-0123-4abc-8def-0123456789ab', name: 'Maria Silva', email: 'maria@email.com', registration: '001234', createdAt: '2026-09-19T00:00:00.000Z', updatedAt: '2026-09-19T00:00:00.000Z' };
const response = { data: [user], meta: { page: 1, limit: 10, total: 1, totalPages: 1 } };

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={queryClient}><MemoryRouter initialEntries={['/users']}><Routes><Route path="/users" element={<UsersPage />} /><Route path="/users/new" element={<p>New user</p>} /><Route path="/users/:id/edit" element={<p>Edit user</p>} /></Routes></MemoryRouter></QueryClientProvider>);
  return queryClient;
}

async function openDialog() {
  await screen.findByText('Maria Silva');
  fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
  return screen.findByRole('dialog');
}

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('user deletion', () => {
  it('opens an accessible confirmation dialog for the selected user', async () => {
    getUsersMock.mockResolvedValue(response);
    renderPage();
    const dialog = await openDialog();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveTextContent('Maria Silva');
  });

  it('cancels without requesting deletion', async () => {
    getUsersMock.mockResolvedValue(response);
    renderPage();
    const dialog = await openDialog();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  it('deletes the selected user and invalidates the list', async () => {
    getUsersMock.mockResolvedValue(response);
    deleteUserMock.mockResolvedValue(undefined);
    const queryClient = renderPage();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = await openDialog();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Excluir' }));
    await waitFor(() => expect(deleteUserMock).toHaveBeenCalledWith(user.id));
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['users'] });
  });

  it('disables actions while deletion is pending', async () => {
    getUsersMock.mockResolvedValue(response);
    deleteUserMock.mockReturnValue(new Promise(() => {}));
    renderPage();
    const dialog = await openDialog();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Excluir' }));
    expect(await within(dialog).findByRole('button', { name: 'Excluindo...' })).toBeDisabled();
    expect(within(dialog).getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  });

  it('reports a missing user after a 404 response', async () => {
    getUsersMock.mockResolvedValue(response);
    deleteUserMock.mockRejectedValue(Object.assign(new Error('Not found'), { isAxiosError: true, response: { status: 404, data: { message: 'Not found' } } }));
    renderPage();
    const dialog = await openDialog();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Excluir' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Usuário não encontrado.');
  });
});
