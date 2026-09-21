import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { routeDefinitions } from './router';

vi.mock('../services/users.service', () => ({
  usersService: {
    getUsers: vi.fn().mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }),
  },
}));

function renderRoute(initialEntry: string) {
  const router = createMemoryRouter(routeDefinitions, { initialEntries: [initialEntry] });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('router', () => {
  it('renders Home at the root route', () => {
    renderRoute('/');

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders Users at the users route', () => {
    renderRoute('/users');

    expect(screen.getByRole('heading', { name: 'Usuários' })).toBeInTheDocument();
  });
});

afterEach(() => {
  cleanup();
});
