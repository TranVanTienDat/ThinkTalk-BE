export declare class BaseAuthDto {
    email: string;
    password: string;
    type: string;
    device_token: string;
}
export declare class AuthDto extends BaseAuthDto {
    fullName: string;
}
export declare class LoginDto extends BaseAuthDto {
}
