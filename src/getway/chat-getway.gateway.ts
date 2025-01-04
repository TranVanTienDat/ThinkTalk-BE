import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatService } from '../modules/chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGetway implements OnGatewayConnection, OnGatewayDisconnect {
constructor(
  private readonly chatService: ChatService,
) {}

  @WebSocketServer() server: Server;
  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(client: any, chatId: string): Promise<void> {
    await this.chatService.addMembersService(client.id, chatId);
    client.emit('joinGroupConfirmation', { chatId, message: 'You have joined the group successfully.' });
    
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    console.log(`Message from ${client.id}: ${payload}`);
    this.server.emit('message', payload);
  }
}
