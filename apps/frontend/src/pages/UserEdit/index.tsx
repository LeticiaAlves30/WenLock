import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { UserForm } from '../../components/users/UserForm';
import { PageTitle } from '../../components/ui/PageTitle';
import { useUpdateUser } from '../../hooks/useUpdateUser';
import { useUser } from '../../hooks/useUser';
import type { CreateUserFormData, UpdateUserFormData } from '../../schemas/user.schema';
import type { UpdateUserInput } from '../../types/user';
import { getApiErrorMessage, hasApiErrorStatus } from '../../utils/getApiErrorMessage';

type UserFormSubmission = CreateUserFormData | UpdateUserFormData;

function toUpdateUserInput(data: UserFormSubmission): UpdateUserInput {
  const input: UpdateUserInput = {};

  if (typeof data.name === 'string') {
    input.name = data.name;
  }
  if (typeof data.email === 'string') {
    input.email = data.email;
  }
  if (typeof data.registration === 'string') {
    input.registration = data.registration;
  }
  if (typeof data.password === 'string') {
    input.password = data.password;
  }

  return input;
}

export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userQuery = useUser(id);
  const updateUser = useUpdateUser();
  const [submissionError, setSubmissionError] = useState<string>();

  async function handleSubmit(data: UserFormSubmission): Promise<void> {
    if (!id) {
      return;
    }

    setSubmissionError(undefined);

    try {
      await updateUser.mutateAsync({ id, data: toUpdateUserInput(data) });
      navigate('/users', { state: { successMessage: 'Usuário atualizado com sucesso.' } });
    } catch (error: unknown) {
      setSubmissionError(
        hasApiErrorStatus(error, 404)
          ? 'Usuário não encontrado.'
          : getApiErrorMessage(error, 'Não foi possível atualizar o usuário. Tente novamente.'),
      );
    }
  }

  if (!id) {
    return <ErrorState message="Usuário não encontrado." />;
  }

  if (userQuery.isPending) {
    return <LoadingState message="Carregando usuário..." />;
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <ErrorState
        message={hasApiErrorStatus(userQuery.error, 404) ? 'Usuário não encontrado.' : 'Não foi possível carregar o usuário.'}
        onRetry={() => void userQuery.refetch()}
      />
    );
  }

  const user = userQuery.data;

  return (
    <section>
      <PageTitle>Editar usuário</PageTitle>
      {submissionError ? <p role="alert">{submissionError}</p> : null}
      <UserForm
        key={user.id}
        mode="edit"
        defaultValues={{
          name: user.name,
          email: user.email,
          registration: user.registration,
          password: '',
        }}
        isSubmitting={updateUser.isPending}
        onCancel={() => navigate('/users')}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
