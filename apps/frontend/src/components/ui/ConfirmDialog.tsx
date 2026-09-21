import { useEffect, useId, useRef } from 'react';
import { Button } from './Button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
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
    <section
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      aria-modal="true"
      role="dialog"
    >
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      <Button ref={cancelButtonRef} type="button" disabled={isLoading} onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="button" disabled={isLoading} onClick={onConfirm}>
        {isLoading ? 'Excluindo...' : confirmLabel}
      </Button>
    </section>
  );
}
