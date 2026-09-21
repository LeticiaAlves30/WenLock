import { useState } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTitle } from '../../components/ui/PageTitle';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { UserForm } from '../../components/users/UserForm';
import { useCreateUser } from '../../hooks/useCreateUser';
import type { CreateUserInput } from '../../types/user';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

type UserFormSubmission = CreateUserInput | { password?: string };

function isCreateUserInput(data: UserFormSubmission): data is CreateUserInput {
  return (
    typeof data.password === 'string' &&
    'name' in data &&
    'email' in data &&
    'registration' in data
  );
}

export function UserCreatePage() {
  const navigate = useNavigate();
  const { isPending, mutateAsync } = useCreateUser();
  const [submissionError, setSubmissionError] = useState<string>();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  async function handleSubmit(data: UserFormSubmission): Promise<void> {
    if (!isCreateUserInput(data)) {
      return;
    }

    setSubmissionError(undefined);

    try {
      await mutateAsync(data);
      navigate('/users', { state: { successMessage: 'Usuário cadastrado com sucesso.' } });
    } catch (error: unknown) {
      setSubmissionError(
        getApiErrorMessage(error, 'Não foi possível cadastrar o usuário. Tente novamente.'),
      );
    }
  }

  return (
    <section className="space-y-4">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted">
        <Link to="/users" className="hover:text-primary">Usuários</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page" className="text-content">Cadastro de Usuário</span>
      </nav>
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Voltar para usuários" onClick={() => navigate('/users')} className="rounded p-1 text-content transition-colors hover:bg-surface hover:text-primary">
          <ArrowLeft aria-hidden="true" size={25} weight="bold" />
        </button>
        <PageTitle>Cadastro de Usuário</PageTitle>
      </div>
      {submissionError ? <p role="alert" className="text-sm text-danger">{submissionError}</p> : null}
      <UserForm
        mode="create"
        isSubmitting={isPending}
        onCancel={() => setIsCancelDialogOpen(true)}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={isCancelDialogOpen}
        title="Deseja cancelar?"
        description="Os dados inseridos não serão salvos"
        cancelLabel="Não"
        confirmLabel="Sim"
        onCancel={() => setIsCancelDialogOpen(false)}
        onConfirm={() => navigate('/users')}
      />
    </section>
  );
}
