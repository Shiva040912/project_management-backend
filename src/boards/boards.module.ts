import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardSchema } from "./board.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Board', schema: BoardSchema }])
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}