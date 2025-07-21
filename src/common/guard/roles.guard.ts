import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ChatService } from '../../modules/chat/chat.service';
import { Roles } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { matchRoles } from '../utils/matchRole.util';
import { ChatRoles } from 'src/entities/chatMember.entity';

@Injectable()
export class WsRolesGuard implements CanActivate {
  constructor(
    private readonly chatService: ChatService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    console.log('roles', roles);
    if (!roles) {
      return true;
    }
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
    const user = client.data.user;
    const chatId = data?.chatId;

    if (!user || !chatId) {
      return false;
    }

    const role = await this.chatService.getRole(user.id, chatId);
    if (!role) {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    }

    return matchRoles([ChatRoles.ADMIN], role);
  }
}
