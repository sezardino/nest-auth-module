import { Roles } from '@/decorators/roles';
import { CurrentUserEmail, CurrentUserRole } from '@/decorators/user-data';
import { ParseObjectIdPipe } from '@/pipes/parse-object-id.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/crete-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserProfileDto } from './dto/update-profile';
import { UserRole } from './user.schema';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all users' })
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  getUsers(@Query() query: FindUsersDto, @CurrentUserRole() role: UserRole) {
    return this.userService.findMany(query, role);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
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

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  create(@Body() dto: CreateUserDto, @CurrentUserRole() role: UserRole) {
    return this.userService.create(dto, role);
  }

  @Put('profile')
  updateProfile(
    @Body() dto: UpdateUserProfileDto,
    @CurrentUserEmail() userEmail: string,
  ) {
    return this.userService.updateProfile(userEmail, dto);
  }
}
