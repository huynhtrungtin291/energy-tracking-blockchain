import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../constants/permissions.enum';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  // Mật khẩu (đã được mã hóa)
  @Prop({ required: true })
  password: string;

  // Tên người dùng
  @Prop({ required: true })
  name: string;

  // Vai trò người dùng (ADMIN, USER)
  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
    required: true,
  })
  role: UserRole;

  @Prop()
  wallet_address?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = SchemaFactory.createForClass(User);
export { UserSchema };
