import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { LoginPage } from '.';

afterEach(() => {
  cleanup();
});

describe('LoginPage', () => {
  it('renders the login form and toggles password visibility', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const password = screen.getByLabelText('Senha');

    expect(screen.getByRole('heading', { name: 'Bem-vindo!' })).toBeInTheDocument();
    expect(password).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));

    expect(password).toHaveAttribute('type', 'text');
  });

  it('validates required fields without calling an API', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail ou matrícula é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Senha é obrigatória.')).toBeInTheDocument();
  });
});
