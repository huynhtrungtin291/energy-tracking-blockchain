import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResourceUsage } from './schema/resource_usage.schema';
import { CreateResourceUsageDto } from './dto/create-resource_usage.dto';
import { UpdateResourceUsageDto } from './dto/update-resource_usage.dto';

@Injectable()
export class ResourceUsageService {
  constructor(@InjectModel(ResourceUsage.name) private resourceUsageModel: Model<ResourceUsage>) {}

  async create(createResourceUsageDto: CreateResourceUsageDto) {
    const createdResourceUsage = new this.resourceUsageModel(createResourceUsageDto);
    return await createdResourceUsage.save();
  }

  async findAll() {
    return await this.resourceUsageModel.find().exec();
  }

  async findOne(id: string) {
    return await this.resourceUsageModel.findById(id).exec();
  }

  async update(id: string, updateResourceUsageDto: UpdateResourceUsageDto) {
    return await this.resourceUsageModel.findByIdAndUpdate(id, updateResourceUsageDto, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.resourceUsageModel.findByIdAndDelete(id).exec();
  }
}
