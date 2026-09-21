import { Check, X } from '@phosphor-icons/react';
import { useEffect } from 'react';

type ToastProps = {
  message: string;
  onDismiss: () => void;
  duration?: number;
};

export function Toast({ duration = 5000, message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, duration);

    return () => window.clearTimeout(timeout);
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      className="fixed top-20 right-6 z-50 flex min-w-64 items-center gap-3 rounded-md bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg"
    >
      <Check aria-hidden="true" size={22} weight="bold" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        aria-label="Fechar notificação"
        className="rounded p-0.5 text-white transition-colors hover:bg-white/15"
        onClick={onDismiss}
      >
        <X aria-hidden="true" size={22} weight="bold" />
      </button>
    </div>
  );
}
