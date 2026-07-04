import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './project.schema';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can create projects');
    }

    const newProject = new this.projectModel({
      ...createProjectDto,
      ownerId: new Types.ObjectId(user.userId),
      members: [],
      createdAt: new Date(),
    });

    return await newProject.save();
  }

  async findAll(user: any) {
    if (user.role === 'admin') {
      return await this.projectModel
        .find({
          $or: [
            { ownerId: new Types.ObjectId(user.userId) },
            { members: { $in: [user.email] } },
          ],
        })
        .exec();
    }

    return await this.projectModel
      .find({ members: { $in: [user.email] } })
      .exec();
  }

  async addMember(id: string, email: string, user: any) {
    if (!email) {
      throw new BadRequestException('Member email is required');
    }

    const project = await this.projectModel.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      user.role !== 'admin' ||
      project.ownerId?.toString() !== user.userId
    ) {
      throw new ForbiddenException('Only project admin can add members');
    }

    return await this.projectModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { members: email } },
        { new: true },
      )
      .exec();
  }

  async delete(id: string, user: any) {
    const project = await this.projectModel.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      user.role !== 'admin' ||
      project.ownerId?.toString() !== user.userId
    ) {
      throw new ForbiddenException('Only project admin can delete project');
    }

    return await this.projectModel.findByIdAndDelete(id).exec();
  }
}