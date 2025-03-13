import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async LoginUser(@Query('initData') initData: string): Promise<User> {
    return this.usersService.LoginUser(initData);
  }

  @Get(':id')
  async FindUser(@Param('id') id: string) {
    if (!id) {
      throw new Error('Missing id parameter');
    }

    const user = await this.usersService.GetUserWithId(BigInt(id));

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user,
      telegramId: user.telegramId.toString(), // Преобразуем BigInt в string
    };
  }
}
