// backend/src/projects/entities/project.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description!: string;

  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId!: Types.ObjectId;


  @Prop({type:[String], default:[]})
  members!: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);