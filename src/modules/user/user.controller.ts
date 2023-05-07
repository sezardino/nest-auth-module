import { Roles } from '@/decorators/roles';
import { CurrentUserRole } from '@/decorators/user-data';
import { ParseObjectIdPipe } from '@/pipes/parse-object-id.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSubAdminDto } from './dto/crete-sub-admin.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserRole } from './user.schema';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all users' })
  getUsers(@Query() query: FindUsersDto, @CurrentUserRole() role: UserRole) {
    return this.userService.findMany(query, role);
  }

  @Get(':id')
  getUser(@Param('id', ParseObjectIdPipe) userId: string) {
    return this.userService.findOneById(userId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  deleteUser(
    @Param('id', ParseObjectIdPipe) userId: string,
    @CurrentUserRole() role: UserRole,
  ) {
    return this.userService.deleteById(userId, role);
  }

  @Post('sub-admin')
  @Roles(UserRole.ADMIN)
  createSubAdmin(@Body() dto: CreateSubAdminDto) {
    return this.userService.create(dto.email, dto.password, UserRole.SUB_ADMIN);
  }
}
