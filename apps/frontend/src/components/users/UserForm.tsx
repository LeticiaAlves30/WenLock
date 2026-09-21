import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  createUserSchema,
  type CreateUserFormData,
  type CreateUserFormInput,
  type UpdateUserFormData,
  type UpdateUserFormInput,
  updateUserSchema,
} from '../../schemas/user.schema';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type UserFormValues = CreateUserFormData | UpdateUserFormData;
type UserFormInput = CreateUserFormInput | UpdateUserFormInput;

type UserFormProps = {
  mode: 'create' | 'edit';
  defaultValues?: Partial<UserFormInput>;
  onSubmit: (data: UserFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

const createDefaultValues: CreateUserFormInput = {
  name: '',
  email: '',
  registration: '',
  password: '',
};

export function UserForm({
  defaultValues,
  isSubmitting = false,
  mode,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const schema = mode === 'create' ? createUserSchema : updateUserSchema;
  const form = useForm<UserFormInput>({
    defaultValues: { ...createDefaultValues, ...defaultValues },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });
  const {
    formState: { errors, isSubmitting: isFormSubmitting, isValid },
    handleSubmit,
    register,
    trigger,
  } = form;

  useEffect(() => {
    if (mode === 'edit') {
      void trigger();
    }
  }, [mode, trigger]);

  async function handleValidSubmit(data: UserFormInput): Promise<void> {
    await onSubmit(data as UserFormValues);
  }

  const saveDisabled = !isValid || isFormSubmitting || isSubmitting;
  const passwordRequired = mode === 'create';

  return (
    <form noValidate onSubmit={handleSubmit(handleValidSubmit)}>
      <Input
        label="Nome"
        autoComplete="name"
        error={errors.name?.message}
        placeholder="Nome completo"
        required
        {...register('name')}
      />
      <Input
        label="E-mail"
        autoComplete="email"
        error={errors.email?.message}
        placeholder="nome@email.com"
        required
        type="email"
        {...register('email')}
      />
      <Input
        label="Matrícula"
        autoComplete="off"
        error={errors.registration?.message}
        inputMode="numeric"
        placeholder="001234"
        required
        type="text"
        {...register('registration')}
      />
      <Input
        label="Senha"
        autoComplete={mode === 'create' ? 'new-password' : 'off'}
        error={errors.password?.message}
        placeholder={mode === 'edit' ? 'Deixe em branco para manter a senha atual' : 'abc123'}
        required={passwordRequired}
        type="password"
        {...register('password')}
      />
      <Button type="submit" disabled={saveDisabled}>
        {isFormSubmitting || isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
      {onCancel ? (
        <Button type="button" onClick={onCancel}>
          Cancelar
        </Button>
      ) : null}
    </form>
  );
}
