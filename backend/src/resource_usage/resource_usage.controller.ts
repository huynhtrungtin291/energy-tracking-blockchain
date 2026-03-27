import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourceUsageService } from './resource_usage.service';
import { CreateResourceUsageDto } from './dto/create-resource_usage.dto';
import { UpdateResourceUsageDto } from './dto/update-resource_usage.dto';

@Controller('resource-usage')
export class ResourceUsageController {
  constructor(private readonly resourceUsageService: ResourceUsageService) {}

  @Post()
  create(@Body() createResourceUsageDto: CreateResourceUsageDto) {
    return this.resourceUsageService.create(createResourceUsageDto);
  }

  @Get()
  findAll() {
    return this.resourceUsageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceUsageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceUsageDto: UpdateResourceUsageDto) {
    return this.resourceUsageService.update(id, updateResourceUsageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceUsageService.remove(id);
  }
}
