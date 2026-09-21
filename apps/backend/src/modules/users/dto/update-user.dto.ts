import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import {
  USER_NAME_PATTERN,
  USER_PASSWORD_PATTERN,
  USER_REGISTRATION_PATTERN,
} from '../users.constants';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Maria Souza' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(USER_NAME_PATTERN, { message: 'Nome deve conter apenas letras e espaços.' })
  name?: string;

  @ApiPropertyOptional({ example: 'maria.souza@email.com', format: 'email' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '001234',
    description: 'Matrícula numérica preservada como string.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(USER_REGISTRATION_PATTERN, {
    message: 'Matrícula deve conter somente dígitos.',
  })
  registration?: string;

  @ApiPropertyOptional({ example: 'abc123', minLength: 6, maxLength: 6 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(USER_PASSWORD_PATTERN, {
    message: 'Senha deve possuir exatamente 6 caracteres alfanuméricos.',
  })
  password?: string;
}
