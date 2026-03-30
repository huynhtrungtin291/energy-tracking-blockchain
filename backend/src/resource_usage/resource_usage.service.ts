import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { ResourceUsage } from './schema/resource_usage.schema';
import { CreateResourceUsageDto } from './dto/create-resource_usage.dto';
import { MonthYearRangeQueryDto, ResponseResourceUsageDto } from './dto/reponse-resource_usage.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
import { UsersService } from 'src/users/users.service';
import { CloudService } from 'src/cloud/cloud.service';

@Injectable()
export class ResourceUsageService {
  constructor(
    @InjectModel(ResourceUsage.name) private ResourceUsageDocument: Model<ResourceUsage>,
    private blockchainService: BlockchainService,
    private usersService: UsersService,
    private cloudService: CloudService,
  ) {}

  async create(createResourceUsageDto: CreateResourceUsageDto, electricFile: Express.Multer.File, waterFile: Express.Multer.File) {
    const createdResourceUsage = new this.ResourceUsageDocument(createResourceUsageDto);
    const co2Emissions = this.calcCO2(Number(createResourceUsageDto.electric), Number(createResourceUsageDto.water));
    const [electricUpload, waterUpload] = await Promise.all([this.cloudService.uploadFile(electricFile, 'electric'), this.cloudService.uploadFile(waterFile, 'water')]);

    const invoice_electric = electricUpload.url;
    const invoice_water = waterUpload.url;
    const name = await this.usersService.findNameByUsername(createResourceUsageDto.username);
    const isUser = await this.usersService.findUserByUserName(createResourceUsageDto.username);
    if (!isUser) {
      throw new Error('User not found');
    }

    createdResourceUsage.username = createResourceUsageDto.username;
    createdResourceUsage.electric = {
      amount_electric: Number(createResourceUsageDto.electric),
      invoice_electric: invoice_electric,
    };
    createdResourceUsage.water = {
      amount_water: Number(createResourceUsageDto.water),
      invoice_water: invoice_water,
    };
    createdResourceUsage.date = createResourceUsageDto.date;
    createdResourceUsage.carbon = co2Emissions;

    const data = {
      username: createdResourceUsage.username,
      name: name || undefined,
      electric: Number(createdResourceUsage.electric.amount_electric),
      water: Number(createdResourceUsage.water.amount_water),
      carbon: Number(createdResourceUsage.carbon),
      date: createdResourceUsage.date,
    };
    console.log('data', data);
    console.log('Data to hash', JSON.stringify(data));
    const dataToHash = this.sha256(data);
    const addressTransaction: string = await this.blockchainService.pushHashToChain(dataToHash);

    createdResourceUsage.dataHash = dataToHash;
    createdResourceUsage.address_transaction = addressTransaction;
    const savedUsage = await createdResourceUsage.save();

    // Xoa du lieu trong buffer sau khi upload xong de giam dau vet trong RAM.
    electricFile.buffer.fill(0);
    waterFile.buffer.fill(0);

    return savedUsage;
  }

  calcCO2(electric_kWh: number, water_m3: number): number {
    const EF_ELECTRIC = 0.85;
    const EF_WATER = 0.4;

    const co2Electric = electric_kWh * EF_ELECTRIC;
    const co2Water = water_m3 * EF_WATER;

    return co2Electric + co2Water;
  }
  sha256(data: object): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  async getYearlyUsage(dataTime: MonthYearRangeQueryDto): Promise<ResponseResourceUsageDto[]> {
    let { from, to } = dataTime;

    // 1. Nếu không có 'from' hoặc 'to', tự động tìm khoảng 12 tháng gần nhất
    if (!from || !to) {
      const latestRecord = await this.ResourceUsageDocument.findOne()
        .sort({ date: -1 }) // Sắp xếp theo field date để lấy cái mới nhất
        .exec();

      if (!latestRecord) return []; // Trả về mảng rỗng nếu DB không có dữ liệu

      to = latestRecord.date;
      const fromDate = new Date(to);
      fromDate.setMonth(to.getMonth() - 12);
      from = fromDate;
    }

    // 2. Query dữ liệu (Dùng chung cho cả 2 trường hợp)
    const dataResponse = await this.ResourceUsageDocument.find({
      date: {
        $gte: from,
        $lte: to,
      },
    }).exec();

    // 3. Map kết quả trả về
    return dataResponse.map((item) => ({
      username: item.username,
      electric: item.electric,
      water: item.water,
      carbon: item.carbon,
      dataHash: item.dataHash,
      address_transaction: item.address_transaction,
      date: item.date,
    }));
  }
}
