import { IUser } from "entities/UserEntity";

export interface IUserRepository{
    createUser(user: IUser): Promise<IUser | null>
    LoginUser(email : string): Promise<IUser | null>
    saveRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>
    googleSignIn(user: Partial<IUser>): Promise<IUser | null>;
    findByUserEmil(email: string): Promise<IUser | null>
    changePassword(password: string, email: string): Promise<IUser | null>;
}