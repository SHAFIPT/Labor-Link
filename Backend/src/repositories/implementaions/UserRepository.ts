import { IUser } from "../../entities/UserEntity";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import User from "../../models/userModel";
import { ApiError } from "../../middleware/errorHander";

export default class UserRepository implements IUserRepository{

    async LoginUser(email : string): Promise<IUser | null> {
        try {
            const registedUser = await User.findOne({ email: email })
            
            if (!registedUser) {
                throw new ApiError(404, 'User is not found')
            }

            return registedUser
            
        } catch (error) {
            
        }
    }

    async createUser(user: IUser): Promise<IUser | null> {
        try {
            const isUserExist = await User.findOne({ email: user.email })
            // console.log('the user is exist showing :',isUserExist)
            
            if (isUserExist) {
                throw new ApiError(404, 'User Already exist...!')
            }

            const newUser = new User(user)
            const savedUser = await newUser.save()

            const createdUser = await User.findById(savedUser._id).select('-password -refreshToken')
            // console.log('this is createdUeser :',createdUser)
            return createdUser
 
        } catch (error) {
            console.error('Error in create user :', error);
            throw new ApiError(500, 'Failed to create user.');
        }
    }

    async saveRefreshToken(userId: string, refreshToken: string): Promise<IUser | null> {
        try {

            let userWithSaveToken = await User.findByIdAndUpdate(userId, { $push: { refreshToken: refreshToken }, new: true })
                .select('-password -refreshToken')
            if (!userWithSaveToken) {
                throw new ApiError(500, 'Failed to save refresh token.');
            }
            return userWithSaveToken
        } catch (error) {
            console.error('Error in saveRefreshToken:', error);
            return null 
        }
    }

    async googleSignIn(user: Partial<IUser>): Promise<IUser | null>{
        try {

            const userExist = await User.findOne({ email: user.email })
            
            if (userExist) {
                return userExist
            }

            const newUser = new User(user)

            const userData = await newUser.save()

            return userData
            
        } catch (error) {
            console.error('Error in googleAuthentication :', error);
            throw new ApiError(500, 'Failed to googleAuthentication.');
        }
    }

    async findByUserEmil(email: string): Promise<IUser | null> {
        try {


            const userfind = await User.findOne({ email })
            
            return userfind
            
        } catch (error) {
            console.error('Error in forgetPasswordOtp send :', error);
            throw new ApiError(500, 'Failed to forgetPasswordOtp send.');
        }
    }

    async changePassword(password: string, email: string): Promise<IUser | null> {
        try {

            const updatePassword = await User.findOneAndUpdate(
            { email: email }, // Query by email
            { $set: { password: password } }, // Update password
            { new: true } // Return the updated document
        );
            return updatePassword
            
        } catch (error) {
            console.error('Error in resetNew password :', error);
            throw new ApiError(500, 'Failed to forgetPasswordOtp send.');
        }
    }

    async removeRefreshToken(userId: string, refreshToken: string): Promise<IUser | null> {
        try {

            const resoponce = await User.findByIdAndUpdate(
                { _id: userId },
                { $pull: { refreshToken: refreshToken } },
                { new: true }).select("-password -refreshToken");
            
            return resoponce

        } catch (error) {
            console.error('Error in Logout :', error);
            throw new ApiError(500, 'Failed to logout');
        }
    }
}