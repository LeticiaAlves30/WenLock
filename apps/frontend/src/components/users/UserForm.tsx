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
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
      className="surface-card space-y-7 p-4 sm:p-6"
    >
      <fieldset>
        <legend className="flex w-full items-center gap-3 text-sm font-bold text-content after:h-px after:flex-1 after:bg-sidebar/35">
          Dados do Usuário
        </legend>
        <div className="mt-5 grid gap-x-5 gap-y-5 md:grid-cols-2">
          <Input aria-label="Nome" label="Nome Completo" autoComplete="name" error={errors.name?.message} hint="Máx. 30 caracteres" placeholder="Nome completo" required {...register('name')} />
          <Input aria-label="Matrícula" label="Matrícula" autoComplete="off" error={errors.registration?.message} hint="Somente números" inputMode="numeric" placeholder="001234" required type="text" {...register('registration')} />
          <Input aria-label="E-mail" label="E-mail" autoComplete="email" error={errors.email?.message} hint="Máx. 40 caracteres" placeholder="nome@email.com" required type="email" {...register('email')} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="flex w-full items-center gap-3 text-sm font-bold text-content after:h-px after:flex-1 after:bg-sidebar/35">
          Dados de acesso
        </legend>
        <div className="mt-5 grid gap-x-5 gap-y-5 md:grid-cols-2">
          <Input aria-label="Senha" label="Senha" autoComplete={mode === 'create' ? 'new-password' : 'off'} error={errors.password?.message} hint={mode === 'create' ? '6 caracteres alfanuméricos' : undefined} placeholder={mode === 'edit' ? 'Deixe em branco para manter a senha atual' : 'abc123'} required={passwordRequired} type="password" {...register('password')} />
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        {onCancel ? <Button type="button" onClick={onCancel} className="h-11 rounded-md border border-sidebar bg-surface px-8 text-sm font-bold text-content transition-colors hover:bg-app-background">Cancelar</Button> : null}
        <Button type="submit" disabled={saveDisabled} className="h-11 rounded-md bg-primary px-9 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
          {isFormSubmitting || isSubmitting ? 'Salvando...' : mode === 'create' ? 'Cadastrar' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
