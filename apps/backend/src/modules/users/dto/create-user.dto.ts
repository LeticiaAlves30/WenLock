import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  USER_NAME_PATTERN,
  USER_PASSWORD_PATTERN,
  USER_REGISTRATION_PATTERN,
} from '../users.constants';

export class CreateUserDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  @Matches(USER_NAME_PATTERN, { message: 'Nome deve conter apenas letras e espaços.' })
  name!: string;

  @ApiProperty({ example: 'maria@email.com', format: 'email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '001234', description: 'Matrícula numérica preservada como string.' })
  @IsString()
  @IsNotEmpty()
  @Matches(USER_REGISTRATION_PATTERN, {
    message: 'Matrícula deve conter somente dígitos.',
  })
  registration!: string;

  @ApiProperty({ example: 'abc123', minLength: 6, maxLength: 6 })
  @IsString()
  @IsNotEmpty()
  @Matches(USER_PASSWORD_PATTERN, {
    message: 'Senha deve possuir exatamente 6 caracteres alfanuméricos.',
  })
  password!: string;
}
