import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document{
    _id: ObjectId | null;
    name: string | null;
    email: string | null;
    password: string | null;
    ProfilePic: string | null;
    role: string | null;
    isBlocked: boolean | null;
    Chat: ObjectId | null;
    refreshToken: string[];
}