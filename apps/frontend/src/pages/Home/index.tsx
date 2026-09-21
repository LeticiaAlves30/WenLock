import { PageTitle } from '../../components/ui/PageTitle';

const formattedDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date());

export function HomePage() {
  return (
    <section className="space-y-6 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-heading">
      <PageTitle>Home</PageTitle>

      <article className="surface-card relative flex min-h-[calc(100vh-10.5rem)] flex-col overflow-hidden p-6 sm:p-8">
        <header>
          <p className="text-lg font-semibold text-content">Olá!</p>
          <p className="mt-1 text-sm font-medium capitalize text-muted">{formattedDate}</p>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center pb-16 text-center">
          <div className="h-48 w-full" aria-hidden="true" />
          <div className="mt-8 rounded-md bg-primary/10 px-6 py-4">
            <p className="text-lg font-bold text-heading">Bem-vindo ao WenLock!</p>
          </div>
        </div>
      </article>
    </section>
  );
}
