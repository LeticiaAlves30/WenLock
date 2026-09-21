import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'c0a8012e-0123-4abc-8def-0123456789ab', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Maria Silva' })
  name!: string;

  @ApiProperty({ example: 'maria@email.com', format: 'email' })
  email!: string;

  @ApiProperty({ example: '001234' })
  registration!: string;

  @ApiProperty({ example: '2026-09-19T00:00:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-19T00:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;
}
