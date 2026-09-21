import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UserForm } from './UserForm';

function fillValidCreateForm() {
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria Silva' } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'Maria@Email.com' } });
  fireEvent.change(screen.getByLabelText('Matrícula'), { target: { value: '001234' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'abc123' } });
}

afterEach(() => {
  cleanup();
});

describe('UserForm', () => {
  it('starts with the save button disabled', () => {
    render(<UserForm mode="create" onSubmit={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled();
  });

  it('displays an error for an invalid name', async () => {
    render(<UserForm mode="create" onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria 2' } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Nome deve conter apenas letras e espaços.',
    );
  });

  it('displays an error for an invalid email', async () => {
    render(<UserForm mode="create" onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maria-email.com' } });

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail inválido.');
  });

  it('displays an error for a registration containing letters', async () => {
    render(<UserForm mode="create" onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Matrícula'), { target: { value: '00A123' } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Matrícula deve conter somente dígitos.',
    );
  });

  it.each(['abc12', 'abc!23'])('rejects an invalid password: %s', async (password) => {
    render(<UserForm mode="create" onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: password } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Senha deve possuir exatamente 6 caracteres alfanuméricos.',
    );
  });

  it('requires a password when creating a user', async () => {
    render(<UserForm mode="create" onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria Silva' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maria@email.com' } });
    fireEvent.change(screen.getByLabelText('Matrícula'), { target: { value: '001234' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled();
    });
  });

  it('enables save and submits normalized valid create data', async () => {
    const onSubmit = vi.fn();
    render(<UserForm mode="create" onSubmit={onSubmit} />);
    fillValidCreateForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Maria Silva',
        email: 'maria@email.com',
        registration: '001234',
        password: 'abc123',
      });
    });
  });

  it('accepts an empty password in edit mode and does not submit it', async () => {
    const onSubmit = vi.fn();
    render(
      <UserForm
        mode="edit"
        defaultValues={{
          name: 'Maria Silva',
          email: 'maria@email.com',
          registration: '001234',
          password: '',
        }}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Maria Silva',
        email: 'maria@email.com',
        registration: '001234',
        password: undefined,
      });
    });
  });

  it('submits a valid password in edit mode', async () => {
    const onSubmit = vi.fn();
    render(
      <UserForm
        mode="edit"
        defaultValues={{
          name: 'Maria Silva',
          email: 'maria@email.com',
          registration: '001234',
          password: '',
        }}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'abc456' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'abc456',
          registration: '001234',
        }),
      );
    });
  });

  it('disables save while an external submission is in progress', () => {
    render(
      <UserForm
        mode="edit"
        defaultValues={{
          name: 'Maria Silva',
          email: 'maria@email.com',
          registration: '001234',
        }}
        isSubmitting
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled();
  });
});
