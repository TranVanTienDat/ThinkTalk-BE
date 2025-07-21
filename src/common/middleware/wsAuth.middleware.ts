import { Socket } from 'socket.io';
import { WsAuthGuard } from '../guard/ws-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { UserPayload } from 'src/modules/auth/dto/user-payload.dto';

export class WsJwtMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handle(client: Socket): UserPayload {
    const token = this.extractTokenFromSocket(client);
    if (!token) throw new WsException('Token not found');

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      client.data.user = payload;
      return payload;
    } catch (err) {
      throw err;
    }
  }

  private extractTokenFromSocket(client: Socket): string | undefined {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

type SocketAuthMiddleware = { (socket: Socket, next: (err?: Error) => void) };

export const socketAuthMiddleware = (
  socket: Socket,
  jwtService: JwtService,
  configService: ConfigService,
): SocketAuthMiddleware => {
  return (socket, next) => {
    try {
      const mw = new WsJwtMiddleware(jwtService, configService);
      mw.handle(socket);
      next();
    } catch (error) {
      return next(error);
    }
  };
};
