import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtMiddleware } from 'src/common/middleware/wsAuth.middleware';
import { WsUser } from 'src/common/decorators/ws-user.decorator';
import { WsAuthGuard } from 'src/common/guard/ws-auth.guard';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
@UseGuards(WsAuthGuard)
export class NotificationGateway implements OnGatewayConnection {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket): Promise<any> {
    new WsJwtMiddleware(this.jwtService, this.configService).handle(socket);
    const user = socket?.data?.user;

    if (!user) {
      socket.disconnect();
      return;
    }

    // Join room với user id để nhận notification cá nhân
    socket.join(user.id);
  }

  @SubscribeMessage('update-notification')
  async update(
    @MessageBody() data: { id: string; payload: UpdateNotificationDto },
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    const updatedNotification = await this.notificationService.update(
      data.id,
      data.payload,
    );
    // Gửi lại cho chính user đó ở các session khác
    socket.to(user.id).emit('notification-updated', updatedNotification);
    return updatedNotification;
  }
}
