import { NavLink } from 'react-router-dom';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

function HomeIcon() {
  return <span aria-hidden="true">⌂</span>;
}

function UsersIcon() {
  return <span aria-hidden="true">◉</span>;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigationItemClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors',
      isActive ? 'bg-primary text-white' : 'text-white/80 hover:bg-white/10 hover:text-white',
      collapsed ? 'justify-center px-2' : '',
    ].join(' ');

  return (
    <aside
      className={[
        'relative flex min-h-screen shrink-0 flex-col bg-sidebar text-white transition-[width] duration-200',
        collapsed ? 'w-20' : 'w-64',
      ].join(' ')}
    >
      <div className="flex h-20 items-center px-6">
        <span className="text-xl font-extrabold tracking-tight">{collapsed ? 'W' : 'WenLock'}</span>
      </div>

      <nav aria-label="Navegação principal" className="flex-1 px-3">
        <NavLink end to="/" className={navigationItemClass} aria-label="Home">
          <HomeIcon />
          {!collapsed ? <span>Home</span> : null}
        </NavLink>
        {!collapsed ? (
          <p className="mt-8 px-3 text-xs font-bold uppercase tracking-wider text-white/45">
            Controle de Acesso
          </p>
        ) : null}
        <NavLink to="/users" className={'mt-2 ' + navigationItemClass} aria-label="Usuários">
          <UsersIcon />
          {!collapsed ? <span>Usuários</span> : null}
        </NavLink>
      </nav>

      <button
        type="button"
        aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        className="absolute -right-3 top-24 flex size-6 items-center justify-center rounded-full border border-sidebar/20 bg-surface text-sidebar shadow-sm hover:bg-app-background"
        onClick={onToggle}
      >
        <span aria-hidden="true">{collapsed ? '›' : '‹'}</span>
      </button>

      <footer className="border-t border-white/10 px-6 py-5 text-xs leading-6 text-white/55">
        {collapsed ? (
          <span aria-label="WenLock">© W</span>
        ) : (
          <>
            <p>© WenLock</p>
            <p>Power by Conecthus</p>
            <p>Version 0.1.0</p>
          </>
        )}
      </footer>
    </aside>
  );
}
