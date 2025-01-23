import { IUser } from "../../entities/UserEntity";
import { IUserSideRepository } from "../../repositories/interface/IUserSideRepository";
import User from "../../models/userModel";
import { ApiError } from "../../middleware/errorHander";



export default class UserSideRepository implements IUserSideRepository{
    async fetchUser(userId: string): Promise<IUser | null> {
        return User.findById(userId).select('-password -refreshToken')
    }
    async profileUpdate(userData: IUser): Promise<IUser | null> {
    return await User.findOneAndUpdate(
        { email: userData.email },
        {
        $set: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            ...(userData.ProfilePic && { ProfilePic: userData.ProfilePic })
        }
        },
        { new: true } // Return the updated document
    );
    }
    async updatePassword(email: string, NewPassword: string): Promise<IUser | null> {
        return await User.findOneAndUpdate(
            { email }, // Query by email
            { $set: { password: NewPassword } }, // Update password field
            { new: true } // Return the updated document
        );
    }
}