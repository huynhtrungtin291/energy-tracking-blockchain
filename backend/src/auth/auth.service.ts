import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { StrategiesDto } from './dto/strategies.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<object | null> {
    const user = await this.usersService.findUserByUserName(username);
    if (user) {
      const isMatch = await this.checkPassword(password, user.password);

      if (isMatch) {
        // const result: StrategiesDto = { ...user };
        const result: StrategiesDto = {
          name: user.name,
          username: user.username,
          role: user.role,
        };
        console.log('User data for token generation:', result); // Debug: Kiểm tra dữ liệu người dùng trước khi tạo token
        return { token: await this.generateToken(result) };
      }
    }

    return { message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
  }
  async checkPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(user: StrategiesDto): Promise<string> {
    const payload = { ...user };
    return await this.jwtService.signAsync(payload);
  }
}
