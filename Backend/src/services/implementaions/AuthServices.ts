import { IAuthService } from './../interface/IAuthservices';
import bcrypt from 'bcrypt'
import { IUser } from '../../entities/UserEntity';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import User from '../../models/userModel';
import { ApiError } from '../../middleware/errorHander';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenUtils';

export  class AuthService implements IAuthService{
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async register(user: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string; } | null> {
        try {
            // console.log('Received user data for registration:', user);
            const hashedPassword = await bcrypt.hash(user.password , 10)
            const newUser = new User({
                ...user, 
                password: hashedPassword,
            })
            //  console.log('New user object after password hash:', newUser);
            const createUser = await this.userRepository.createUser(newUser)

            // console.log('User created in the database:', createUser); 

            if (!createUser) {
               throw new ApiError(404 , 'Faild to register new user....!')
            }

            const accessToken = generateAccessToken({
                id: createUser.id,
                role : createUser.role
            })

            const refreshToken = generateRefreshToken({
                id: createUser.id,
                role : createUser.role
            })

            const userAfterSavedToken = await this.userRepository.saveRefreshToken(createUser.id, refreshToken)
            
            //  console.log('User with refresh token saved:', userAfterSavedToken); 
            
            return {
                user: userAfterSavedToken,
                accessToken,
                refreshToken,
            }

        } catch (error) {
            console.error('Error during registration in AuthService:', error);
            throw new ApiError(500, 'Failed to register user.');
        }
    }

    async googleSignIn(user: Partial<IUser>): Promise<{ user: IUser, accessToken: string, refreshToken: string } | null>{
        try {
            
            const useAfterSuccess = await this.userRepository.googleSignIn(user);

            if (!useAfterSuccess) {
                return null;
            }

            const userId = useAfterSuccess.id || (useAfterSuccess.toObject && useAfterSuccess.toObject().id);
  
            if (!userId) {
                throw new Error('User ID is not available');
            }

            const accessToken = generateAccessToken({ id: userId, role: useAfterSuccess.role });
            const refreshToken = generateRefreshToken({ id: userId, role: useAfterSuccess.role });

            const userAfterSavedToken = await this.userRepository.saveRefreshToken(userId, refreshToken)

            return {
                user: userAfterSavedToken,
                accessToken,
                refreshToken,
            }


        } catch (error) {
            console.error('Error during Google sign-in:', error);
            return null;
        }
    }
}