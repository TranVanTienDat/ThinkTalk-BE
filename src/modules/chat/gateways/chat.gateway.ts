import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '../chat.service';

@WebSocketGateway()
export class ChatWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() server;

  handleConnection(socket: Socket): void {
    const socketId = socket.id;
    console.log(`New connecting... socket id:`, socket);
    // ChatWebsocketGateway.participants.set(socketId, '');
  }

  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;
    console.log(`Disconnection... socket id:`, socketId);
    // const roomId = ChatWebsocketGateway.participants.get(socketId);
    // const room = ChatWebsocketGateway.rooms.get(roomId);
    // if (room) {
    //     room.participants.get(socketId).connected = false;
    //     this.server.emit(
    //         `participants/${roomId}`,
    //         Array.from(room.participants.values()),
    //     );
    // }
  }

  @SubscribeMessage('create-group')
  async create(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    console.log(
      `Registering new participant... socket id: %s and participant: `,
      socketId,
    );
  }

  @SubscribeMessage('update-group')
  async update(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    console.log(
      `Registering new participant... socket id: %s and participant: `,
      socketId,
    );
  }

  @SubscribeMessage('delete-group')
  async delete(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    console.log(
      `Registering new participant... socket id: %s and participant: `,
      socketId,
    );
  }

  @SubscribeMessage('get-conversation')
  async get(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    console.log(
      `Registering new participant... socket id: %s and participant: `,
      socketId,
    );
  }
}
