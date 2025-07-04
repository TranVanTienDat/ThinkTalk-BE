import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto, JoinRoomDto, LeaveRoomDto } from './dto/message.dto';
import { WsAuthGuard } from '../../common/guard/websocket-auth.guard';
import { WsUser } from '../../common/decorators/ws-user.decorator';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { ChatRole } from '../../entities/chatMember.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  socketAuthMiddleware,
  WsJwtMiddleware,
} from 'src/common/middleware/wsAuth.middleware';
import { ChatFilter } from './dto/chat.filter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsAuthGuard)
export class ChatWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  @WebSocketServer() server;

  // Lưu trữ thông tin socket của user
  private userSockets = new Map<string, string>(); // userId -> socketId

  async handleConnection(socket: Socket): Promise<any> {
    new WsJwtMiddleware(this.jwtService, this.configService).handle(socket);
    console.log('handleConnection', socket.data);
    if (!socket?.data?.user) {
      socket.disconnect();
      return;
    }
  }

  handleDisconnect(socket: Socket): void {
    const user = socket.data.user as UserPayload;

    console.log('handleDisconnect User', user);
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

      if (!conversations.data) {
        socket.emit('conversations-not-found', {
          success: false,
          message: 'Không tìm thấy danh sách cuộc trò chuyện',
        });
        return {
          success: false,
          message: 'Không tìm thấy danh sách cuộc trò chuyện',
        };
      }

      // Kiểm tra user có trong nhóm không

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
      console.log('user 123', user);
      console.log('data', data);
      const socketId = socket.id;
      data.chatMembers.push({ userId: user.id, role: ChatRole.ADMIN });
      // Tự động thêm người tạo vào nhóm với role admin
      // if (!data.chatMembers.find((member) => member.userId === user.id)) {
      //   data.chatMembers.push({ userId: user.id, role: ChatRole.ADMIN });
      // }

      // Tạo nhóm chat
      // const newChat = await this.chatService.createService(data);

      // Gửi thông báo tạo nhóm thành công cho người tạo
      socket.emit('group-created', {
        success: true,
        message: 'Nhóm đã được tạo thành công',
        // chat: newChat,
      });

      const memberIds = data.chatMembers.map((member) => member.userId);
      this.notifyGroupMembers(memberIds, 'new-group-created', {
        chat: 'test',
        message: `Bạn đã được thêm vào nhóm "${data.name}"`,
        createdBy: user.email,
      });

      // return { success: true, chat: newChat };
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

  @SubscribeMessage('update-group')
  async update(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    try {
      const socketId = socket.id;
      console.log(
        `Updating group... socket id: ${socketId}, user: ${user.email}`,
        data,
      );

      const { chatId, updateData } = data;

      // Kiểm tra quyền admin
      const isAdmin = await this.chatService.isAdminChat(user.id, chatId);
      if (!isAdmin) {
        socket.emit('group-updated', {
          success: false,
          message: 'Bạn không có quyền cập nhật nhóm này',
        });
        return { success: false, message: 'Không có quyền' };
      }

      const updatedChat = await this.chatService.updateService(
        chatId,
        updateData,
      );

      // Lấy thông tin nhóm để gửi thông báo
      const chat = await this.chatService.getConverseService(chatId);

      // Gửi thông báo cập nhật thành công
      socket.emit('group-updated', {
        success: true,
        message: 'Nhóm đã được cập nhật thành công',
        chat: updatedChat,
      });

      // Gửi thông báo đến tất cả thành viên trong nhóm
      this.notifyGroupMembers(chat.userIds, 'group-updated', {
        chat: updatedChat,
        message: `Nhóm "${chat.name}" đã được cập nhật`,
        updatedBy: user.email,
      });

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
      const isAdmin = await this.chatService.isAdminChat(user.id, chatId);
      if (!isAdmin) {
        socket.emit('group-deleted', {
          success: false,
          message: 'Bạn không có quyền xóa nhóm này',
        });
        return { success: false, message: 'Không có quyền' };
      }

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

      // Gửi thông báo đến tất cả thành viên trong nhóm
      this.notifyGroupMembers(chat.userIds, 'group-deleted', {
        chatId: chatId,
        message: `Nhóm "${chat.name}" đã bị xóa`,
        deletedBy: user.email,
      });

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
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    try {
      const { chatId } = data;

      // Kiểm tra user có trong nhóm không
      const conversation = await this.chatService.getConverseService(chatId);
      if (!conversation || !conversation.userIds.includes(user.id)) {
        socket.emit('room-join-failed', {
          success: false,
          message: 'Bạn không có quyền tham gia phòng này',
        });
        return { success: false, message: 'Không có quyền tham gia' };
      }

      socket.join(`chat-${chatId}`);
      console.log(`User ${user.email} joined room: chat-${chatId}`);

      socket.emit('room-joined', {
        success: true,
        roomId: `chat-${chatId}`,
        message: 'Đã tham gia phòng chat',
      });

      return { success: true, roomId: `chat-${chatId}` };
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
    @MessageBody() data: LeaveRoomDto,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: UserPayload,
  ) {
    const { chatId } = data;
    socket.leave(`chat-${chatId}`);
    console.log(`User ${user.email} left room: chat-${chatId}`);

    socket.emit('room-left', {
      success: true,
      roomId: `chat-${chatId}`,
      message: 'Đã rời khỏi phòng chat',
    });
  }

  // Phương thức hỗ trợ gửi thông báo đến các thành viên trong nhóm
  private notifyGroupMembers(userIds: string[], event: string, data: any) {
    userIds.forEach((userId) => {
      const socketId = this.userSockets.get(userId);
      if (socketId) {
        this.server.to(socketId).emit(event, data);
        console.log(`Sent ${event} to user ${userId} (socket: ${socketId})`);
      } else {
        console.log(`User ${userId} is not online, cannot send notification`);
      }
    });
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

      // Kiểm tra user có trong nhóm không
      const conversation = await this.chatService.getConverseService(chatId);
      if (!conversation || !conversation.userIds.includes(user.id)) {
        socket.emit('message-send-failed', {
          success: false,
          message: 'Bạn không có quyền gửi tin nhắn trong nhóm này',
        });
        return { success: false, message: 'Không có quyền gửi tin nhắn' };
      }

      // Gửi tin nhắn đến tất cả thành viên trong phòng
      this.server.to(`chat-${chatId}`).emit('new-message', {
        chatId,
        message,
        senderId: user.id,
        senderEmail: user.email,
        messageType: messageType || 'text',
        timestamp: new Date(),
      });

      console.log(`Message sent to chat ${chatId} by ${user.email}:`, message);

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message-send-failed', {
        success: false,
        message: 'Có lỗi xảy ra khi gửi tin nhắn',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }
}
