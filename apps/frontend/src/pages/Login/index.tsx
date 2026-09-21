import { Eye, EyeSlash } from '@phosphor-icons/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import wenlockLogo from '../../assets/wenlock-logo.svg';
import { startDemoSession } from '../../auth/session';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'E-mail ou matrícula é obrigatório.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormData>({
    defaultValues: { identifier: '', password: '' },
    mode: 'onSubmit',
    resolver: zodResolver(loginSchema),
  });

  function handleValidSubmit(): void {
    startDemoSession();
    navigate('/', { replace: true });
  }

  return (
    <main className="grid min-h-screen bg-sidebar lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex min-h-52 items-center justify-center px-8 py-12 lg:min-h-screen">
        <img src={wenlockLogo} alt="WenLock" className="h-auto w-full max-w-md" />
      </section>

      <section className="flex items-center justify-center px-5 pb-10 lg:p-10">
        <div className="min-h-[36rem] w-full max-w-[34rem] rounded-lg bg-surface p-8 shadow-2xl sm:p-12 lg:p-10 xl:p-14">
          <header>
            <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">Bem-vindo!</h1>
            <p className="mt-3 text-base font-semibold text-content">Entre com sua conta</p>
          </header>

          <form className="mt-10 space-y-5" noValidate onSubmit={handleSubmit(handleValidSubmit)}>
            <div>
              <label
                htmlFor="login-identifier"
                className="mb-2 block text-sm font-semibold text-content"
              >
                E-mail ou N° matrícula
              </label>
              <input
                id="login-identifier"
                type="text"
                autoComplete="username"
                placeholder="E-mail ou N° matrícula"
                aria-invalid={Boolean(errors.identifier)}
                aria-describedby={errors.identifier ? 'login-identifier-error' : undefined}
                className="h-12 w-full rounded-md border border-sidebar/15 px-4 text-sm text-content placeholder:text-muted"
                {...register('identifier')}
              />
              {errors.identifier ? (
                <p id="login-identifier-error" role="alert" className="mt-2 text-sm text-danger">
                  {errors.identifier.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-semibold text-content"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Senha"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  className="h-12 w-full rounded-md border border-sidebar/15 py-2 pr-12 pl-4 text-sm text-content placeholder:text-muted"
                  {...register('password')}
                />
                <button
                  type="button"
                  aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted hover:text-primary"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                >
                  {isPasswordVisible ? <EyeSlash size={21} /> : <Eye size={21} />}
                </button>
              </div>
              {errors.password ? (
                <p id="login-password-error" role="alert" className="mt-2 text-sm text-danger">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 h-12 w-full rounded-md bg-primary text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              Entrar
            </Button>
          </form>

          <p className="mt-7 text-center text-sm font-semibold text-primary">Esqueci minha senha</p>
        </div>
      </section>
    </main>
  );
}
