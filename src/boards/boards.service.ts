import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './board.schema';

@Injectable()
export class BoardsService {
  constructor(@InjectModel('Board') private boardModel: Model<Board>) {}

  async create(title: string, projectId: string) {
    const newBoard = new this.boardModel({ title, projectId });
    return await newBoard.save();
  }

  async findAllByProject(projectId: string) {
    return await this.boardModel.find({ projectId }).exec();
  }

  async delete(id: string) {
    return await this.boardModel.findByIdAndDelete(id);
  }
}