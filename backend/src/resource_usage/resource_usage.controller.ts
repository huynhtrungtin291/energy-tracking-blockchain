import { Controller, Post, Body, UseInterceptors, UploadedFiles, BadRequestException, UseGuards } from '@nestjs/common';
import { ResourceUsageService } from './resource_usage.service';
import { CreateResourceUsageDto } from './dto/create-resource_usage.dto';
import { MonthYearRangeAndUserQueryDto } from './dto/reponse-resource_usage.dto';
import { ImageUploadInterceptor } from 'src/interceptors/file-upload.utils';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@Controller('resource-usage')
export class ResourceUsageController {
  constructor(private readonly resourceUsageService: ResourceUsageService) {}

  @UseInterceptors(ImageUploadInterceptor)
  @UseGuards(RolesGuard)
  @Post()
  create(@UploadedFiles() files: { electric?: Express.Multer.File[]; water?: Express.Multer.File[] }, @Body() createResourceUsageDto: CreateResourceUsageDto) {
    const electricFile = files.electric?.[0];
    const waterFile = files.water?.[0];

    if (!electricFile || !waterFile) {
      throw new BadRequestException('Vui lòng gửi đủ 2 file với key electric và water');
    }

    return this.resourceUsageService.create(createResourceUsageDto, electricFile, waterFile);
  }

  @Post('yearly-usage')
  getYearlyUsage(@Body() dataTime?: MonthYearRangeAndUserQueryDto) {
    return this.resourceUsageService.getYearlyUsage(dataTime || {});
  }
}
