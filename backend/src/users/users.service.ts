import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const checkUserName = await this.checkUserName(createUserDto.username);
    if (checkUserName) {
      return { message: 'Tên người dùng đã tồn tại' };
    } else {
      const createdUser = new this.userModel({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
      });
      await createdUser.save();
      return { message: 'Tạo user thành công' };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash: string = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async checkUserName(username: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username: username }).exec();
    return !!user; // Trả về true nếu user tồn tại, false nếu không tồn tại
  }

  async findUserByUserName(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username: username }).exec();
  }

  async findNameByUsername(username: string): Promise<string | null> {
    const user = await this.findUserByUserName(username);
    return user ? user.name : null;
  }

  async getAllUsernames(): Promise<string[]> {
    const users = await this.userModel.find({}, 'username').exec();
    return users.map((user) => user.username);
  }
}
