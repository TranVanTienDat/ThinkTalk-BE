import { ChatRoles } from 'src/entities/chatMember.entity';

export const matchRoles = (rolesBase: ChatRoles[], role: ChatRoles) =>
  rolesBase.some((r) => r === role);
