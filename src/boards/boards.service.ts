import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './board.schema';
import { Project } from '../projects/project.schema';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(title: string, projectId: string, user: any) {
    if (!title || !projectId) {
      throw new BadRequestException('Board title and projectId are required');
    }

    const project = await this.projectModel.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      user.role !== 'admin' ||
      project.ownerId?.toString() !== user.userId
    ) {
      throw new ForbiddenException('Only project admin can create boards');
    }

    const newBoard = new this.boardModel({ title, projectId });
    return await newBoard.save();
  }

  async findAllByProject(projectId: string) {
    return await this.boardModel.find({ projectId }).exec();
  }

  async delete(id: string, user: any) {
    const board = await this.boardModel.findById(id);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const project = await this.projectModel.findById(board.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      user.role !== 'admin' ||
      project.ownerId?.toString() !== user.userId
    ) {
      throw new ForbiddenException('Only project admin can delete boards');
    }

    return await this.boardModel.findByIdAndDelete(id);
  }
}