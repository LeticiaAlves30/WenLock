import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';
import { UserResponseDto } from './user-response.dto';

export class UsersListResponseDto {
  @ApiProperty({ type: () => UserResponseDto, isArray: true })
  data!: UserResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
