import { Controller, Post, Body } from '@nestjs/common';
import { ResourceUsageService } from './resource_usage.service';
import { CreateResourceUsageDto } from './dto/create-resource_usage.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { MonthYearRangeQueryDto } from './dto/reponse-resource_usage.dto';
@Controller('resource-usage')
export class ResourceUsageController {
  constructor(private readonly resourceUsageService: ResourceUsageService) {}

  @Roles()
  @Post()
  create(@Body() createResourceUsageDto: CreateResourceUsageDto) {
    return this.resourceUsageService.create(createResourceUsageDto);
  }

  @Roles()
  @Post('yearly-usage')
  getYearlyUsage(@Body() dataTime?: MonthYearRangeQueryDto) {
    return this.resourceUsageService.getYearlyUsage(dataTime || {});
  }
}
