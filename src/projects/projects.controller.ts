import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    return this.projectsService.create(createProjectDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    return this.projectsService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/members')
  async addMember(@Param('id') id: string, @Body('email') email: string) {
    return await this.projectsService.addMember(id, email);
  }

  // --- ITHU THAAN MISSING-AH IRUNTHATHU ---
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.projectsService.delete(id);
  }
}
