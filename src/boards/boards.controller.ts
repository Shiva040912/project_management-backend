import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {
    const projectId = body.projectId || body.project;
    return this.boardsService.create(body.title, projectId, req.user);
  }

  @Get(':projectId')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.boardsService.findAllByProject(projectId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.boardsService.delete(id, req.user);
  }
}