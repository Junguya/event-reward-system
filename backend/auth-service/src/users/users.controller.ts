import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users') // Swagger 왼쪽 메뉴에서 'Users' 그룹으로 나옴
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: CreateUserDto }) // Swagger에서 body 필드 자동 문서화
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
    };
  }
}
