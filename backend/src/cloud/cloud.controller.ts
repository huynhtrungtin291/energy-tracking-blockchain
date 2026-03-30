import { Controller } from '@nestjs/common';
import { CloudService } from './cloud.service';

@Controller('cloud')
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}
}
