import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './project.schema'; // Unga entity path-ai check pannikonga
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  // 1. Role-based Project Listing (Admin vs Member)
  // source: 3, 4
  async findAll(user: any) {
    // Admin-a irundha, avan create panna projects-ai mattum kaattum
    if (user.role === 'admin') {
      // string-ai ObjectId-ah matha Types.ObjectId use pannunga
      return await this.projectModel
        .find({ ownerId: new Types.ObjectId(user.userId) })
        .exec();
    }

    // Member-a irundha, avan email irukkura projects-ai mattum kaattum
    return await this.projectModel
      .find({ members: { $in: [user.email] } })
      .exec();
  }

  // 2. Project Creation (ownerId-oda save pannum)
  async create(createProjectDto: CreateProjectDto, user: any) {
    const newProject = new this.projectModel({
      ...createProjectDto,
      ownerId: new Types.ObjectId(user.userId), // JWT-la irunthu varura userId
      members: [], // Initial-ah empty list
      createdAt: new Date(),
    });
    return await newProject.save();
  }
  async addMember(id: string, email: string) {
    // Members array-la email-ai push panrom
    return await this.projectModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { members: email } }, // $addToSet dupliate aavadha thadukum
        { new: true },
      )
      .exec();
  }

  // 3. Project Delete (Only Admin check - Controller-la or Service-la add pannikonga)
  async delete(id: string) {
    return await this.projectModel.findByIdAndDelete(id).exec();
  }
}
