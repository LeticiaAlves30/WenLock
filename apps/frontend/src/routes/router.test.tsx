import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation, useRoutes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { routeDefinitions } from './router';
import { clearDemoSession, hasDemoSession, startDemoSession } from '../auth/session';

vi.mock('../services/users.service', () => ({
  usersService: {
    getUsers: vi.fn().mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }),
  },
}));

function RouterUnderTest() {
  const location = useLocation();
  const routes = useRoutes(routeDefinitions);

  return (
    <>
      {routes}
      <output data-testid="current-location">{location.pathname}</output>
    </>
  );
}

function renderRoute(initialEntry: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <RouterUnderTest />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('router', () => {
  it('starts at Login when there is no frontend session', async () => {
    renderRoute('/');

    expect(await screen.findByRole('heading', { name: 'Bem-vindo!' })).toBeInTheDocument();
  });

  it('redirects a protected route to Login when there is no session', async () => {
    renderRoute('/users');

    expect(await screen.findByRole('heading', { name: 'Bem-vindo!' })).toBeInTheDocument();
  });

  it('redirects an authenticated user away from Login', async () => {
    startDemoSession();
    renderRoute('/login');

    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });

  it('creates the frontend session and redirects to Home after Login', async () => {
    renderRoute('/login');

    fireEvent.change(screen.getByLabelText('E-mail ou N° matrícula'), {
      target: { value: 'milena.santana@energy.org.br' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'demo-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument();
    expect(hasDemoSession()).toBe(true);
    expect(screen.getByTestId('current-location')).toHaveTextContent('/');
  });

  it('opens and closes the profile dropdown when clicking outside', async () => {
    startDemoSession();
    renderRoute('/');

    fireEvent.click(await screen.findByRole('button', { name: 'Abrir menu do perfil' }));
    expect(screen.getByRole('menu', { name: 'Menu do perfil' })).toBeInTheDocument();
    expect(screen.getByText('Milena Santana Borges')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Menu do perfil' })).not.toBeInTheDocument();
    });
  });

  it('clears the session and redirects to Login after logout', async () => {
    startDemoSession();
    renderRoute('/');

    fireEvent.click(await screen.findByRole('button', { name: 'Abrir menu do perfil' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Sair' }));

    expect(await screen.findByRole('heading', { name: 'Bem-vindo!' })).toBeInTheDocument();
    expect(hasDemoSession()).toBe(false);
    expect(screen.getByTestId('current-location')).toHaveTextContent('/login');
  });
});

afterEach(() => {
  cleanup();
  clearDemoSession();
});
