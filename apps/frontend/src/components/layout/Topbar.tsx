import { SignOut } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearDemoSession, DEMO_USER } from '../../auth/session';

export function Topbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent): void {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  function handleLogout(): void {
    clearDemoSession();
    setIsProfileMenuOpen(false);
    navigate('/login', { replace: true });
  }

  return (
    <header className="flex h-16 items-center justify-end border-b border-sidebar/10 bg-surface px-6 shadow-sm lg:px-8">
      <div ref={profileMenuRef} className="relative">
        <button
          type="button"
          aria-label="Abrir menu do perfil"
          aria-expanded={isProfileMenuOpen}
          aria-haspopup="menu"
          className="flex size-9 items-center justify-center rounded-full bg-sidebar text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
          onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
        >
          {DEMO_USER.initials}
        </button>

        {isProfileMenuOpen ? (
          <div
            role="menu"
            aria-label="Menu do perfil"
            className="absolute right-0 z-20 mt-3 w-56 rounded-md border border-sidebar/10 bg-surface p-3 shadow-lg"
          >
            <span
              aria-hidden="true"
              className="absolute -top-1.5 right-3 size-3 rotate-45 border-t border-l border-sidebar/10 bg-surface"
            />
            <div className="relative flex items-center gap-3 border-b border-sidebar/10 pb-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar text-sm font-bold text-white">
                {DEMO_USER.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-primary">{DEMO_USER.name}</p>
                <p className="truncate text-xs text-muted">{DEMO_USER.email}</p>
              </div>
            </div>
            <button
              type="button"
              role="menuitem"
              className="mt-2 flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm font-semibold text-content hover:bg-app-background hover:text-primary"
              onClick={handleLogout}
            >
              <SignOut aria-hidden="true" size={18} weight="bold" />
              Sair
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
