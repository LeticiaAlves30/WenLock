import {
  CaretDown,
  CaretLeft,
  CaretRight,
  ChartPieSlice,
  IdentificationCard,
  User,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import wenlockLogo from '../../assets/wenlock-logo.svg';
import wenlockSymbol from '../../assets/wenlock-symbol.svg';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [isAccessControlExpanded, setIsAccessControlExpanded] = useState(true);
  const homeNavigationClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex min-h-11 items-center gap-3 rounded px-3 text-sm font-semibold transition-colors',
      isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white',
      collapsed ? 'justify-center px-2' : '',
    ].join(' ');

  const usersNavigationClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex min-h-11 items-center gap-3 rounded px-3 text-sm font-bold transition-colors',
      isActive ? 'bg-primary text-sidebar' : 'text-white/75 hover:bg-white/10 hover:text-white',
      collapsed ? 'justify-center px-2' : '',
    ].join(' ');

  return (
    <aside
      className={[
        'relative flex min-h-screen shrink-0 flex-col bg-sidebar text-white shadow-[3px_0_10px_rgb(13_25_49/18%)] transition-[width] duration-200',
        collapsed ? 'w-20' : 'w-64',
      ].join(' ')}
    >
      <div className={`flex h-24 items-center ${collapsed ? 'justify-center px-2' : 'px-7'}`}>
        {collapsed ? (
          <img src={wenlockSymbol} alt="WenLock" className="h-auto w-14" />
        ) : (
          <img src={wenlockLogo} alt="WenLock" className="h-auto w-full max-w-48" />
        )}
      </div>

      <nav aria-label="Navegação principal" className="flex-1 px-4">
        <NavLink end to="/" className={homeNavigationClass} aria-label="Home">
          <ChartPieSlice aria-hidden="true" size={18} weight="duotone" />
          {!collapsed ? <span>Home</span> : null}
        </NavLink>

        <div className="mt-5">
          <button
            type="button"
            aria-controls="access-control-navigation"
            aria-expanded={isAccessControlExpanded}
            aria-label={isAccessControlExpanded ? 'Recolher Controle de Acesso' : 'Expandir Controle de Acesso'}
            onClick={() => setIsAccessControlExpanded((isExpanded) => !isExpanded)}
            className={[
              'flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm font-semibold text-white/65 transition-colors hover:text-white',
              collapsed ? 'justify-center px-2' : '',
            ].join(' ')}
          >
            <IdentificationCard aria-hidden="true" size={18} weight="fill" />
            {!collapsed ? (
              <>
                <span className="flex-1">Controle de Acesso</span>
                <CaretDown
                  aria-hidden="true"
                  size={15}
                  weight="bold"
                  className={`transition-transform ${isAccessControlExpanded ? '' : '-rotate-90'}`}
                />
              </>
            ) : null}
          </button>
          {isAccessControlExpanded ? (
            <NavLink
              id="access-control-navigation"
              to="/users"
              className={({ isActive }) =>
                `${collapsed ? 'mt-2' : 'mt-2 ml-6'} ${usersNavigationClass({ isActive })}`
              }
              aria-label="Usuários"
            >
              <User aria-hidden="true" size={18} weight="fill" />
              {!collapsed ? <span>Usuários</span> : null}
            </NavLink>
          ) : null}
        </div>
      </nav>

      <button
        type="button"
        aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        className="absolute -right-5 top-10 flex size-7 items-center justify-center rounded-full border border-sidebar/20 bg-surface text-sidebar shadow-sm hover:bg-app-background"
        onClick={onToggle}
      >
        {collapsed ? (
          <CaretRight aria-hidden="true" size={15} weight="bold" />
        ) : (
          <CaretLeft aria-hidden="true" size={15} weight="bold" />
        )}
      </button>

      <footer className="px-7 py-5 text-[10px] leading-[1.35] text-white/55">
        {collapsed ? (
          <span aria-label="WenLock">© W</span>
        ) : (
          <>
            <p className="text-sm font-bold text-white">© WenLock</p>
            <p>Power by Conecthus</p>
            <p>V 0.0.0</p>
          </>
        )}
      </footer>
    </aside>
  );
}
