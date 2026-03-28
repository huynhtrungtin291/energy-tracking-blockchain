import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceUsageService } from './resource_usage.service';
import { ResourceUsageController } from './resource_usage.controller';
import { ResourceUsage, ResourceUsageSchema } from './schema/resource_usage.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ResourceUsage.name, schema: ResourceUsageSchema }])],
  controllers: [ResourceUsageController],
  providers: [ResourceUsageService],
  exports: [ResourceUsageService],
})
export class ResourceUsageModule {}
