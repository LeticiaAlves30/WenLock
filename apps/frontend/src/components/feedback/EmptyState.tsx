type EmptyStateProps = {
  title: string;
  message: string;
  illustrationSrc?: string;
  illustrationAlt?: string;
};

export function EmptyState({
  illustrationAlt = '',
  illustrationSrc,
  message,
  title,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
      {illustrationSrc ? (
        <img src={illustrationSrc} alt={illustrationAlt} className="mb-5 h-auto w-40 sm:w-48" />
      ) : null}
      <h2 className="text-lg font-bold text-heading">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{message}</p>
    </div>
  );
}
