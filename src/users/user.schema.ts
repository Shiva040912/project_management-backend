import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Role {
  Admin = 'admin',
  Member = 'member',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: String, enum: Role, default: Role.Member })
  role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);