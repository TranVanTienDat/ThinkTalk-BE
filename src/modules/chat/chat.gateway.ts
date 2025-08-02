import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Roles } from 'src/common/decorators/roles.decorator';
import { WsRolesGuard } from 'src/common/guard/roles.guard';
import { WsJwtMiddleware } from 'src/common/middleware/wsAuth.middleware';
import { ResponseDataWs } from 'src/common/types';
import { StatusMessage } from 'src/entities/messageRead.entity';
import { WsUser } from '../../common/decorators/ws-user.decorator';
import { WsAuthGuard } from '../../common/guard/ws-auth.guard';
import { ChatRoles } from '../../entities/chatMember.entity';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { CreateMessageDto } from '../message/dto/create.dto';
import { MessageService } from '../message/message.service';
import { ChatService } from './chat.service';
import { ChatFilter } from './dto/chat.filter';
import { CreateChatDto } from './dto/create-chat.dto';
import { RoomDto, SendMessageDto } from './dto/message.dto';
import { UpdateChatDtoSW } from './dto/update-chat.dto';
import { MessageReadService } from '../message-read/message-read.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
@UseGuards(WsAuthGuard)
export class ChatWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly msgService: MessageService,
    private readonly msgReadService: MessageReadService,
  ) {}
  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket): Promise<any> {
    new WsJwtMiddleware(this.jwtService, this.configService).handle(socket);
    const user = socket?.data?.user;

    if (!user) {
      socket.disconnect();
      return;
    }

    const chatIds = await this.chatService.getAllChatId(user);
    await this.joinRoom(chatIds, socket);
  }

  handleDisconnect(socket: Socket): void {
    const user = socket.data.user as UserPayload;
  }

  @SubscribeMessage('get-conversations')
  async getConversations(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe({ transform: true })) filter: ChatFilter,
  ) {
    try {
      const conversations = await this.chatService.getChatByUserService(
        filter,
        socket.data.user,
      );

      if (!conversations.data.length) {
        socket.emit('conversations-not-found', {
          success: false,
          message: 'Không tìm thấy danh sách cuộc trò chuyện',
        });
        return {
          success: false,
          message: 'Không tìm thấy danh sách cuộc trò chuyện',
        };
      }

      const joined = await this.joinRoom(
        conversations.data.map((chat) => ({ chatId: chat.id })),
        socket,
      );

      socket.emit('conversations-retrieved', {
        success: true,
        conversation: conversations,
      });

      return { success: true, conversation: conversations };
    } catch (error) {
      console.error('Error getting conversation:', error);
      socket.emit('conversations-retrieved', {
        success: false,
        message: 'Có lỗi xảy ra khi lấy thông tin danh sách cuộc trò chuyện',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('get-detail-conversation')
  async getDetailConversation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() id: string,
  ) {
    try {
      const detail = await this.chatService.getDetailChatService(id);

      if (!detail) {
        socket.emit('detail-conversation-not-found', {
          success: false,
          message: 'Không tìm thấy chi tiết cuộc trò chuyện',
        });
        return {
          success: false,
          message: 'Không tìm thấy chi tiết cuộc trò chuyện',
        };
      }

      socket.emit('detail-conversation', {
        success: true,
        conversation: detail,
      });

      return { success: true, conversation: detail };
    } catch (error) {
      console.error('Error getting conversation:', error);
      socket.emit('detail-conversation', {
        success: false,
        message: 'Có lỗi xảy ra khi lấy chi tiết cuộc trò chuyện',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('create-group')
  async create(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    try {
      data.chatMembers.push({ userId: user.id, role: ChatRoles.ADMIN });

      // Tạo nhóm chat
      const newChat = await this.chatService.createService(data);

      const rooms = await this.joinRoom([{ chatId: newChat.id }], socket);
      const res: ResponseDataWs = {
        status: 'success',
        data: newChat,
        message: 'Created group success!',
        sender: user,
      };

      this.notifyGroupMembers(
        `group-${newChat.id}`,
        res,
        socket,
        'group-created',
      );

      return { success: true, chat: newChat };
    } catch (error) {
      console.error('Error creating group:', error);
      socket.emit('group-created', {
        success: false,
        message: 'Có lỗi xảy ra khi tạo nhóm',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsRolesGuard)
  @Roles([ChatRoles.ADMIN])
  @SubscribeMessage('update-group')
  async update(
    @MessageBody() dataBody: UpdateChatDtoSW,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    try {
      const { chatId, data } = dataBody;
      console.log('dataBody', dataBody);
      const updatedChat = await this.chatService.updateService(chatId, data);

      const res: ResponseDataWs = {
        status: 'success',
        data: updatedChat,
        message: 'Update chat success!',
        sender: 'system',
      };

      this.notifyGroupMembers(`group-${chatId}`, res, socket, 'group-updated');

      return { success: true, chat: updatedChat };
    } catch (error) {
      console.error('Error updating group:', error);
      socket.emit('group-updated', {
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật nhóm',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('delete-group')
  async delete(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    try {
      const socketId = socket.id;
      console.log(
        `Deleting group... socket id: ${socketId}, user: ${user.email}`,
        data,
      );

      const { chatId } = data;

      // Kiểm tra quyền admin
      // const isAdmin = await this.chatService.isAdminChat(user.id, chatId);
      // if (!isAdmin) {
      //   socket.emit('group-deleted', {
      //     success: false,
      //     message: 'Bạn không có quyền xóa nhóm này',
      //   });
      //   return { success: false, message: 'Không có quyền' };
      // }

      // Lấy thông tin nhóm trước khi xóa
      const chat = await this.chatService.getConverseService(chatId);

      // Xóa nhóm
      await this.chatService.removeChatService(chatId);

      // Gửi thông báo xóa thành công
      socket.emit('group-deleted', {
        success: true,
        message: 'Nhóm đã được xóa thành công',
        chatId: chatId,
      });

      // this.notifyGroupMembers(chat.userIds, 'group-deleted', {
      //   chatId: chatId,
      //   message: `Nhóm "${chat.name}" đã bị xóa`,
      //   deletedBy: user.email,
      // });

      return { success: true, chatId: chatId };
    } catch (error) {
      console.error('Error deleting group:', error);
      socket.emit('group-deleted', {
        success: false,
        message: 'Có lỗi xảy ra khi xóa nhóm',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('get-conversation')
  async get(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    try {
      const socketId = socket.id;
      console.log(
        `Getting conversation... socket id: ${socketId}, user: ${user.email}`,
        data,
      );

      const { chatId } = data;
      const conversation = await this.chatService.getConverseService(chatId);

      if (!conversation) {
        socket.emit('conversation-not-found', {
          success: false,
          message: 'Không tìm thấy cuộc trò chuyện',
        });
        return { success: false, message: 'Không tìm thấy cuộc trò chuyện' };
      }

      // Kiểm tra user có trong nhóm không
      const isMember = conversation.userIds.includes(user.id);
      if (!isMember) {
        socket.emit('conversation-not-found', {
          success: false,
          message: 'Bạn không có quyền truy cập cuộc trò chuyện này',
        });
        return { success: false, message: 'Không có quyền truy cập' };
      }

      socket.emit('conversation-retrieved', {
        success: true,
        conversation: conversation,
      });

      return { success: true, conversation: conversation };
    } catch (error) {
      console.error('Error getting conversation:', error);
      socket.emit('conversation-retrieved', {
        success: false,
        message: 'Có lỗi xảy ra khi lấy thông tin cuộc trò chuyện',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @MessageBody() data: RoomDto[],
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      if (!data.length) {
        socket.emit('room-join-failed', {
          success: false,
          message: 'Bạn không có quyền tham gia phòng này',
        });
        return { success: false, message: 'Không có quyền tham gia' };
      }
      data.forEach((chat) => {
        socket.join(`group-${chat.chatId}`);
      });

      // console.log('rooms: ', socket.rooms);
      return { success: true, roomIds: data };
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('room-join-failed', {
        success: false,
        message: 'Có lỗi xảy ra khi tham gia phòng',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(
    @MessageBody() data: RoomDto[],
    @ConnectedSocket() socket: Socket,
  ) {
    if (!data.length) {
      socket.emit('room-left-failed', {
        success: false,
        message: 'Bạn không quyền rời phòng này',
      });
      return { success: false, message: 'Không có quyền rời phòng' };
    }

    data.forEach((chat) => {
      socket.leave(`group-${chat.chatId}`);
      socket.emit('room-left', {
        success: true,
        roomId: `group-${chat.chatId}`,
        message: 'Đã rời khỏi phòng chat',
      });
    });
  }

  // Event để join room mới khi được thêm vào group
  @SubscribeMessage('join-new-room')
  async joinNewRoom(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    try {
      const { chatId } = data;

      // Kiểm tra user có trong nhóm không
      const conversation = await this.chatService.getConverseService(chatId);
      if (!conversation || !conversation.userIds.includes(user.id)) {
        socket.emit('new-room-join-failed', {
          success: false,
          message: 'Bạn không có quyền tham gia phòng này',
        });
        return { success: false, message: 'Không có quyền tham gia' };
      }

      socket.join(`chat-${chatId}`);
      console.log(`User ${user.email} joined new room: chat-${chatId}`);

      socket.emit('new-room-joined', {
        success: true,
        roomId: `chat-${chatId}`,
        message: 'Đã tham gia phòng chat mới',
      });

      return { success: true, roomId: `chat-${chatId}` };
    } catch (error) {
      console.error('Error joining new room:', error);
      socket.emit('new-room-join-failed', {
        success: false,
        message: 'Có lỗi xảy ra khi tham gia phòng mới',
        error: error.message,
      });
      return { success: false, message: error.message };
    }
  }

  // Phương thức hỗ trợ chỉ gửi thông báo đến các thành viên khác trong nhóm
  private notifyGroupMembers(
    roomId: string,
    data: ResponseDataWs,
    socket: Socket | Server,
    nameEmit: string,
  ) {
    socket.to(roomId).emit(nameEmit, {
      ...data,
    });

    // return { success: false, message:  };
  }

  // Phương thức gửi tin nhắn đến phòng chat
  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    try {
      const { chatId, message, messageType } = data;

      const conversation = await this.chatService.getConverseService(chatId);
      if (!conversation || !conversation.userIds.includes(user.id)) {
        socket.emit('message-send-failed', {
          success: false,
          message: 'Bạn không có quyền gửi tin nhắn trong nhóm này',
        });
        return { success: false, message: 'Không có quyền gửi tin nhắn' };
      }

      const msg: CreateMessageDto = {
        content: message,
        chatId: chatId,
        type: messageType,
        senderId: user.id,
      };

      const createdMsg = await this.msgService.create(msg);

      const res: ResponseDataWs = {
        status: 'success',
        data: createdMsg,
        message: 'Send message success!',
      };

      this.notifyGroupMembers(
        `group-${chatId}`,
        res,
        this.server,
        'sended-message',
      );

      return { success: true, message: 'Gửi tin nhắn thành công', data: data };
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('sended-message', {
        status: 'error',
        message: 'Có lỗi xảy ra khi gửi tin nhắn',
        error: error.message,
        data: data,
        userId: user.id,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('user_online')
  async connectNetwork(
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {}

  @SubscribeMessage('messages:batch-read')
  async trackingMessage(
    @ConnectedSocket() socket: Socket,
    @Body() data: { chatId: string; messageIds: string[] },
    @WsUser() user: UserPayload,
  ) {
    try {
      const dataMaping = data.messageIds.map((item) => ({
        messageId: item,
        userId: user.id,
      }));

      const msgRead = await this.msgReadService.create(dataMaping);
      const dataReturn = {
        chatId: data.chatId,
        messageReads: msgRead.raw,
      };
      const res: ResponseDataWs = {
        status: 'success',
        data: dataReturn,
        message: 'Send message success!',
      };

      this.notifyGroupMembers(
        `group-${data.chatId}`,
        res,
        this.server,
        'message-read',
      );
      return {
        success: true,
        message: 'Gửi tin nhắn thành công',
        data: msgRead,
      };
    } catch (error) {
      console.log('error', error);
      socket.emit('message-read', {
        status: 'error',
        message: 'Có lỗi xảy ra khi xem tin nhắn',
        error: error.message,
        data: data,
        userId: user.id,
      });
      return { success: false, error: error.message };
    }
  }
}
