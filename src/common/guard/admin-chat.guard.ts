import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChatService } from '../../modules/chat/chat.service';
import { ChatRoles } from 'src/entities/chatMember.entity';

@Injectable()
export class AdminChatGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private chatService: ChatService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const chatId = request.params.chatId;

    if (!user || !chatId) {
      return false;
    }

    const isAdmin = await this.chatService.getRole(user.id, chatId);
    return isAdmin === ChatRoles.ADMIN;
  }
}
