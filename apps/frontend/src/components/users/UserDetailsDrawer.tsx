import { X } from '@phosphor-icons/react';
import { useEffect, useId, useRef } from 'react';
import type { User } from '../../types/user';
import { Button } from '../ui/Button';

type UserDetailsDrawerProps = {
  user: User | null;
  onClose: () => void;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}

export function UserDetailsDrawer({ onClose, user }: UserDetailsDrawerProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose, user]);

  if (!user) {
    return null;
  }

  const hasBeenUpdated = user.updatedAt !== user.createdAt;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar visualização do usuário"
        className="absolute inset-0 bg-sidebar/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface px-6 py-5 shadow-2xl sm:px-7"
      >
        <header className="flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-extrabold text-content">
            Visualizar Usuário
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Fechar visualização"
            className="rounded p-1 text-muted transition-colors hover:bg-app-background hover:text-content"
            onClick={onClose}
          >
            <X aria-hidden="true" size={25} weight="bold" />
          </button>
        </header>

        <section className="mt-5">
          <h3 className="flex items-center gap-3 text-xs font-bold text-content after:h-px after:flex-1 after:bg-sidebar/35">
            Dados do Usuário
          </h3>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-6 text-sm">
            <div>
              <dt className="text-muted">Nome</dt>
              <dd className="mt-2 font-bold text-content">{user.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Matrícula</dt>
              <dd className="mt-2 font-bold text-content">{user.registration}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted">E-mail</dt>
              <dd className="mt-2 break-words font-bold text-content">{user.email}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-7">
          <h3 className="flex items-center gap-3 text-xs font-bold text-content after:h-px after:flex-1 after:bg-sidebar/35">
            Detalhes
          </h3>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 text-sm">
            <div>
              <dt className="text-muted">Data de criação</dt>
              <dd className="mt-2 font-bold text-content">{formatDate(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">Última edição</dt>
              <dd className="mt-2 font-bold text-content">
                {hasBeenUpdated ? formatDate(user.updatedAt) : 'Nenhuma'}
              </dd>
            </div>
          </dl>
        </section>

        <footer className="mt-auto pt-8 text-center">
          <Button
            type="button"
            onClick={onClose}
            className="h-11 min-w-28 rounded-md border border-sidebar bg-surface px-6 text-sm font-bold text-content transition-colors hover:bg-app-background"
          >
            Fechar
          </Button>
        </footer>
      </aside>
    </div>
  );
}
