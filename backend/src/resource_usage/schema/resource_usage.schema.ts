import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResourceUsageDocument = HydratedDocument<ResourceUsage>;

@Schema({ timestamps: true })
export class ResourceUsage {
  @Prop({ required: true })
  username: string; // mã nhân viên

  @Prop({
    required: true,
    _id: false,
    type: {
      amount_electric: { type: Number, required: true }, // float
      invoice_electric: { type: String, required: true }, // URL hình ảnh
    },
  })
  electric: {
    amount_electric: number;
    invoice_electric: string;
  };

  @Prop({
    required: true,
    _id: false,
    type: {
      amount_water: { type: Number, required: true }, // float
      invoice_water: { type: String, required: true }, // URL hình ảnh
    },
  })
  water: {
    amount_water: number;
    invoice_water: string;
  };

  @Prop({ required: true })
  carbon: number; // float

  @Prop({ required: true })
  dataHash: string; // Mã SHA-256 của toàn bộ nội dung báo cáo

  @Prop({ required: true })
  address_transaction: string; // Mã giao dịch trên Blockchain sau khi đẩy thành công

  @Prop({ required: true })
  date: Date; // Ngày tháng của báo cáo (ví dụ: ngày 15/08/2023)

  createdAt?: Date;
  updatedAt?: Date;
}

const ResourceUsageSchema = SchemaFactory.createForClass(ResourceUsage);
export { ResourceUsageSchema };
