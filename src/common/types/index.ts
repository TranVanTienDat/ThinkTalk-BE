import { UserPayload } from 'src/modules/auth/dto/user-payload.dto';

export type ResponseDataWs = {
  status: 'success' | 'error';
  message: string;
  data: any;
  sender?: UserPayload | 'system';
  statusCode?: string | number;
  timestamp?: string;
};
