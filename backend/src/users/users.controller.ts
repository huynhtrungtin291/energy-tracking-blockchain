import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Req } from '@nestjs/common';
import { ChangePasswordDto } from './dto/update-user.dto';
import { requestUser } from './decorators/user.decorator';
// import { Public } from 'src/auth/decorators/public.decorator';
// import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('get-all-usernames')
  async getAllUsernames() {
    return this.usersService.getAllUsernames();
  }

  @Post('change-password')
  async changePassword(@Req() @Body() dto: ChangePasswordDto, @requestUser('username') username: string) {
    return this.usersService.updatePassword(username, dto.oldPassword, dto.newPassword);
  }
}
