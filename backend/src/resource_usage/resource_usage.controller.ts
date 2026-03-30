import { Controller, Post, Body, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ResourceUsageService } from './resource_usage.service';
import { CreateResourceUsageDto } from './dto/create-resource_usage.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { MonthYearRangeQueryDto } from './dto/reponse-resource_usage.dto';
import { ImageUploadInterceptor } from 'src/interceptors/file-upload.utils';
@Controller('resource-usage')
export class ResourceUsageController {
  constructor(private readonly resourceUsageService: ResourceUsageService) {}

  @UseInterceptors(ImageUploadInterceptor)
  @Roles()
  @Post()
  create(@UploadedFiles() files: { electric?: Express.Multer.File[]; water?: Express.Multer.File[] }, @Body() createResourceUsageDto: CreateResourceUsageDto) {
    const electricFile = files.electric?.[0];
    const waterFile = files.water?.[0];

    if (!electricFile || !waterFile) {
      throw new BadRequestException('Vui lòng gửi đủ 2 file với key electric và water');
    }

    return this.resourceUsageService.create(createResourceUsageDto, electricFile, waterFile);
  }

  @Roles()
  @Post('yearly-usage')
  getYearlyUsage(@Body() dataTime?: MonthYearRangeQueryDto) {
    return this.resourceUsageService.getYearlyUsage(dataTime || {});
  }
}
