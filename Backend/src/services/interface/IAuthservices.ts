import { IUser } from "entities/UserEntity";

export interface IAuthService{
    register(user: Partial<IUser>): Promise<{user: IUser ; accessToken: string; refreshToken : string}>
} 