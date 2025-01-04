import { BaseEntity } from '../common/entities/base.entity';
import { User } from './user.entity';
export declare class Device extends BaseEntity {
    user_id: string;
    device_id: string;
    type: string;
    device_token: string;
    user: User;
}
