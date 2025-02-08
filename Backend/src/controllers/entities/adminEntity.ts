export interface IAdmin{
    _id?:string,
    email?:string,
    password?:string,
    role?: string,
    refreshToken: string [] | null;
}