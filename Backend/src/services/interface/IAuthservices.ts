import { IUser } from "entities/UserEntity";

export interface IAuthService{
    register(user: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string }>
    googleSignIn(user: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string; } | null>;
    login(user: Partial<IUser>): Promise<{ accessToken: string; refreshToken: string, userFound: Omit<IUser, "password">; }>
    findUserWithEmail(email: string): Promise<IUser | null>;
    generateTokenForForgotPassword(user: Partial<IUser>): string;
    decodeAndVerifyToken(token: string): Promise<Partial<IUser | null>>;
    changePassword(password:string,email:string):Promise <IUser| null>;
} 