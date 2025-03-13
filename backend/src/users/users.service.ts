import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
  ) {}

  async CreateUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async GetUserWithId(id: bigint): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { telegramId: id },
    });
  }

  async LoginUser(initData: string): Promise<string | null> {
    const jsonString = initData.startsWith('user=')
      ? initData.slice(5)
      : initData;
    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('invalidData');
    }

    const telegramId = parsedData.id;

    console.log('id tg: ' + telegramId + ' initData: ' + initData);

    if (!initData) throw new UnauthorizedException('initData kaida');
    if (!telegramId) throw new UnauthorizedException('Missing tg id');

    const user = await this.prisma.user.findUnique({
      where: { telegramId: BigInt(parseInt(telegramId, 10)) },
    });

    if (user) return this.auth.generateToken(user.id);

    const newUser = await this.serializeUser(
      this.prisma.user.create({
        data: {
          telegramId: BigInt(parseInt(telegramId, 10)),
          firstName: parsedData.first_name || '',
          username: parsedData.username,
        },
      }),
    );

    if (!newUser) throw new UnauthorizedException('Nea');
    return this.auth.generateToken(newUser.id);
  }
  private serializeUser(user: any) {
    return JSON.parse(
      JSON.stringify(user, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
  }
}
