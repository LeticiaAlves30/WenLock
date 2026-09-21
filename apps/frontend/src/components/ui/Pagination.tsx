import { Button } from './Button';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages === 0) {
    return null;
  }

  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <nav aria-label="Paginação">
      <Button type="button" disabled={!canGoBack} onClick={() => onPageChange(page - 1)}>
        Anterior
      </Button>
      <span aria-current="page">
        Página {page} de {totalPages}
      </span>
      <Button type="button" disabled={!canGoForward} onClick={() => onPageChange(page + 1)}>
        Próxima
      </Button>
    </nav>
  );
}
