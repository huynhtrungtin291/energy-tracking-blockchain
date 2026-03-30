import { Module } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { CloudController } from './cloud.controller';

@Module({
  controllers: [CloudController],
  providers: [CloudService],
  exports: [CloudService],
})
export class CloudModule {}
