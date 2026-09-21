import { Button } from '../ui/Button';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section role="alert">
      <p>{message}</p>
      {onRetry ? <Button onClick={onRetry}>Tentar novamente</Button> : null}
    </section>
  );
}
