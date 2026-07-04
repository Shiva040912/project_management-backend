import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { Board } from '../boards/board.schema';
import { Project } from '../projects/project.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  private async checkAdminAccessByBoard(boardId: string, user: any) {
    const board = await this.boardModel.findById(boardId);

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
      throw new ForbiddenException('Only project admin can modify tasks');
    }

    return board;
  }

  private async checkAdminAccessByTask(taskId: string, user: any) {
    const task = await this.taskModel.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkAdminAccessByBoard(task.boardId, user);

    return task;
  }

  async create(taskData: any, user: any) {
    if (!taskData.boardId) {
      throw new BadRequestException('boardId is required');
    }

    await this.checkAdminAccessByBoard(taskData.boardId, user);

    const newTask = new this.taskModel(taskData);
    return await newTask.save();
  }

  async findAllByBoard(boardId: string) {
    return await this.taskModel.find({ boardId }).exec();
  }

  async updateStatus(id: string, status: string, user: any) {
    await this.checkAdminAccessByTask(id, user);

    return await this.taskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }

  async update(id: string, taskData: any, user: any) {
    await this.checkAdminAccessByTask(id, user);

    return await this.taskModel.findByIdAndUpdate(id, taskData, {
      new: true,
    });
  }

  async delete(id: string, user: any) {
    await this.checkAdminAccessByTask(id, user);

    return await this.taskModel.findByIdAndDelete(id);
  }
}