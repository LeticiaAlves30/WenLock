import { z } from 'zod';

const namePattern = /^(?=.*[A-Za-zÀ-ÖØ-öø-ÿ])[A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
const registrationPattern = /^\d+$/;
const passwordPattern = /^[A-Za-z0-9]{6}$/;

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Nome é obrigatório.')
  .regex(namePattern, 'Nome deve conter apenas letras e espaços.');

const emailSchema = z
  .string()
  .trim()
  .min(1, 'E-mail é obrigatório.')
  .email('E-mail inválido.')
  .transform((value) => value.toLowerCase());

const registrationSchema = z
  .string()
  .trim()
  .min(1, 'Matrícula é obrigatória.')
  .regex(registrationPattern, 'Matrícula deve conter somente dígitos.');

const passwordSchema = z
  .string()
  .regex(passwordPattern, 'Senha deve possuir exatamente 6 caracteres alfanuméricos.');

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  registration: registrationSchema,
  password: passwordSchema,
});

const optionalPasswordSchema = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .refine(
    (value) => value === undefined || passwordPattern.test(value),
    'Senha deve possuir exatamente 6 caracteres alfanuméricos.',
  );

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  registration: registrationSchema.optional(),
  password: optionalPasswordSchema.optional(),
});

export type CreateUserFormData = z.output<typeof createUserSchema>;
export type UpdateUserFormData = z.output<typeof updateUserSchema>;
export type CreateUserFormInput = z.input<typeof createUserSchema>;
export type UpdateUserFormInput = z.input<typeof updateUserSchema>;
