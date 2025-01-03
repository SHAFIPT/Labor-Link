type StringIndexSignatur<T> = {
    [key: string]: T;
}

export interface IUser extends StringIndexSignatur<string | boolean>{
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    profilePic: string;
    role: string;
    refreshToken: string;
    createdAt: string;
    confirmPassword: string;
    isBlocked: boolean;
    phone: string;
}