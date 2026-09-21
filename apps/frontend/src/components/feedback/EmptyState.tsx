type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <h2 className="text-lg font-bold text-heading">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{message}</p>
    </div>
  );
}
