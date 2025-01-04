import { IUser } from "entities/UserEntity";

export interface IUserRepository{
    createUser(user: IUser): Promise<IUser | null>
    saveRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>
    googleSignIn(user: Partial<IUser>): Promise<IUser | null>;
}