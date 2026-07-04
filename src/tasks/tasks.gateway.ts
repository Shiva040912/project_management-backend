import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true }) // Frontend namma backend-oda connect aaga CORS true pannanum
export class TasksGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('taskStatusChanged')
  handleTaskStatusChange(@MessageBody() data: { taskId: string; newStatus: string }) {
    // Member status change pannuna, server ellarukkum broadcast pannum
    this.server.emit('taskUpdated', data);
  }
}