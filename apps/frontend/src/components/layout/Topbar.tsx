export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-end border-b border-sidebar/10 bg-surface px-6 shadow-sm lg:px-8">
      <div
        aria-label="Perfil do usuário"
        role="img"
        className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
      >
        W
      </div>
    </header>
  );
}
