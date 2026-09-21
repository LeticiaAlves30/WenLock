import { Button } from './Button';

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <footer className="flex flex-col gap-4 border-t border-sidebar/10 px-6 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <p>
        Total de itens: <span className="font-bold text-content">{total}</span>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <span>
          Itens por página <span className="font-bold text-content">{limit}</span>
        </span>
        <nav aria-label="Paginação" className="flex items-center gap-2">
          <Button
            type="button"
            aria-label="Página anterior"
            disabled={!canGoBack}
            className="flex size-8 items-center justify-center rounded-md border border-sidebar/15 text-content disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => onPageChange(page - 1)}
          >
            ‹
          </Button>
          <span
            aria-current="page"
            className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-white"
          >
            {page}
          </span>
          <span className="text-xs">de {totalPages}</span>
          <Button
            type="button"
            aria-label="Próxima página"
            disabled={!canGoForward}
            className="flex size-8 items-center justify-center rounded-md border border-sidebar/15 text-content disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => onPageChange(page + 1)}
          >
            ›
          </Button>
        </nav>
      </div>
    </footer>
  );
}
