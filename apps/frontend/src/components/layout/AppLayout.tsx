import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <>
      <header>
        <nav aria-label="Navegação principal">
          <Link to="/">Wenlock</Link>
          <Link to="/users">Usuários</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
