import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { title: string; projectId: string }) {
    return this.boardsService.create(body.title, body.projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':projectId')
  async findAllByProject(@Param('projectId') projectId: string) {
    return this.boardsService.findAllByProject(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.boardsService.delete(id);
  }
}