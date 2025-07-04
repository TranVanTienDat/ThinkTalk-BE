import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../../modules/auth/dto/user-payload.dto';

export const WsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const client = ctx.switchToWs().getClient();
    return client.data.user;
  },
);
