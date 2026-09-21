import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersListResponseDto } from './dto/users-list-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário.' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso.', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos.' })
  @ApiConflictResponse({ description: 'E-mail ou matrícula já cadastrados.' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista usuários com paginação e pesquisa parcial por nome.' })
  @ApiOkResponse({ description: 'Lista paginada de usuários.', type: UsersListResponseDto })
  @ApiBadRequestResponse({ description: 'Parâmetros de paginação inválidos.' })
  findAll(@Query() query: ListUsersQueryDto): Promise<UsersListResponseDto> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuário por UUID.' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Identificador do usuário.' })
  @ApiOkResponse({ description: 'Usuário encontrado.', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'UUID inválido.' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza parcialmente um usuário.',
    description: 'A senha é opcional; quando ausente, a senha atual é mantida.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Identificador do usuário.' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso.', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'UUID ou dados de entrada inválidos.' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  @ApiConflictResponse({ description: 'E-mail ou matrícula já cadastrados.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui fisicamente um usuário.' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Identificador do usuário.' })
  @ApiNoContentResponse({ description: 'Usuário excluído com sucesso.' })
  @ApiBadRequestResponse({ description: 'UUID inválido.' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
