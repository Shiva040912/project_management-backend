import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ required: true })
  boardId!: string;

  @Prop({ default: 'TODO' })
  status!: string;

  @Prop({ default: 'MEDIUM' })
  priority!: string;

  @Prop({ default: '' })
  dueDate!: string;

  @Prop({ default: '' })
  assignedTo!: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);