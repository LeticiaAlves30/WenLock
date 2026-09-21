import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../../components/ui/PageTitle';
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
    <section>
      <PageTitle>Cadastrar usuário</PageTitle>
      {submissionError ? <p role="alert">{submissionError}</p> : null}
      <UserForm
        mode="create"
        isSubmitting={isPending}
        onCancel={() => navigate('/users')}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
