import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { BaseAuthDto, LoginDto } from '../auth/dto/auth.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getRepository(): Repository<User>;
    findUserByEmailService(value: Partial<BaseAuthDto>): Promise<User>;
    findUserByIdService(id: string): Promise<User>;
    findUserService(value: LoginDto): Promise<User>;
}
