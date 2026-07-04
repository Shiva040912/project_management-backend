import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private taskModel: Model<Task>) {}

  async create(taskData: any) {
    const newTask = new this.taskModel(taskData);
    return await newTask.save();
  }

  async findAllByBoard(boardId: string) {
    return await this.taskModel.find({ boardId }).exec();
  }

  async updateStatus(id: string, status: string) {
    return await this.taskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }

  async delete(id: string) {
    return await this.taskModel.findByIdAndDelete(id);
  }
  async update(id: string, taskData: any) {
    return await this.taskModel.findByIdAndUpdate(id, taskData, { new: true });
  }
}
