import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { DEFAULT_USERS_LIMIT, DEFAULT_USERS_PAGE, MAX_USERS_LIMIT } from '../users.constants';

export class ListUsersQueryDto {
  @ApiPropertyOptional({ default: DEFAULT_USERS_PAGE, minimum: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = DEFAULT_USERS_PAGE;

  @ApiPropertyOptional({
    default: DEFAULT_USERS_LIMIT,
    minimum: 1,
    maximum: MAX_USERS_LIMIT,
    example: DEFAULT_USERS_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_USERS_LIMIT)
  limit: number = DEFAULT_USERS_LIMIT;

  @ApiPropertyOptional({
    example: 'maria',
    description: 'Filtro parcial por nome, sem distinção entre maiúsculas e minúsculas.',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
