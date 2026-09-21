import { useEffect, useId, useRef } from 'react';
import { Button } from './Button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  loadingLabel = 'Confirmando...',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && !isLoading) {
      cancelButtonRef.current?.focus();
    }
  }, [isLoading, open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (open && !isLoading && event.key === 'Escape') {
        onCancel();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, onCancel, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sidebar/5 p-4">
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        role="dialog"
        className="w-full max-w-sm rounded-lg border border-sidebar/10 bg-surface px-7 py-8 text-center shadow-lg"
      >
        <h2 id={titleId} className="text-xl font-extrabold text-content">
          {title}
        </h2>
        <p id={descriptionId} className="mt-4 text-sm text-content">
          {description}
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <Button
            ref={cancelButtonRef}
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="h-11 min-w-24 rounded-md border border-sidebar bg-surface px-5 text-sm font-bold text-content transition-colors hover:bg-app-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="h-11 min-w-24 rounded-md bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
