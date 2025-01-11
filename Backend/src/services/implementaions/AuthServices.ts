import { IAuthService } from './../interface/IAuthservices';
import bcrypt from 'bcrypt'
import { IUser } from '../../entities/UserEntity';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import User from '../../models/userModel';
import { ApiError } from '../../middleware/errorHander';
import { generateAccessToken, generateRefreshToken ,accessTokenForReset , decodeAndVerifyToken} from '../../utils/tokenUtils';

export  class AuthService implements IAuthService{
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async login(user: Partial<IUser>): Promise<{ accessToken: string; refreshToken: string; userFound: Omit<IUser, "password">; }> {
        try {
             // Remove the try-catch block here since we want to propagate the specific errors
            const userFound = await this.userRepository.LoginUser(user.email.toString());

            // Handle case when user is not found
            if (!userFound) {
                // throw new ApiError(404, 'User not found', 'User not found. Please check your email.');
                console.log('Invalid credentials...')
                return null
            }

            // Check if password matches
            const isPasswordValid = await bcrypt.compare(user.password.toString(), userFound.password.toString());
            if (!isPasswordValid) {
                // throw new ApiError(401, 'Invalid Credentials', 'Incorrect password. Please try again.');
                 return null
            }

            // Generate tokens if login is successful
            const accessToken = generateAccessToken({
                id: userFound.id,
                role: userFound.role,
            });

            const refreshToken = generateRefreshToken({
                id: userFound.id,
                role: userFound.role,
            });

            const userWithNewToken = await this.userRepository.saveRefreshToken(userFound.id, refreshToken);

            return {
                accessToken,
                refreshToken,
                userFound: userWithNewToken
            };
        } catch (error) {
            if (!(error instanceof ApiError)) {
            throw new ApiError(500, 'Server Error', error.message, error.stack);
        }
        throw error;
        }
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

    async findUserWithEmail(email : string): Promise<IUser | null> {
        try {

            const userFound = await this.userRepository.findByUserEmil(email) 

            console.log('this is service userFound :',userFound)

            if (userFound) { 
                return userFound
            } else {
                return null
            }
            
        } catch (error) {
            console.error('Error during forgotPasswordSendOTP:', error);
            return null;
        }
    }

    generateTokenForForgotPassword(user: Partial<IUser>): string {
         return accessTokenForReset(user)
    }

    decodeAndVerifyToken(token: string): Promise<Partial<IUser | null>> {
        try {

            console.log('This is tokeen to dedode :',token)

            const decode = decodeAndVerifyToken(token)

            console.log('This is decodeAndVerifyToken',decode)


         return decode
            
        } catch (error) {
            return null
        }
    }

    async changePassword(password: string, email: string): Promise<IUser | null> {
        const hashPassword = await bcrypt.hash(password.toString(), 10)

        console.log('this is hashPassword :',hashPassword, email)
        
        const userAfterUpdate = await this.userRepository.changePassword(hashPassword, email)
        
        return userAfterUpdate
    }


    async logout(token: string, id: string): Promise<IUser | null> {
        const user = await this.userRepository.removeRefreshToken(id,token)
    
          return user ? user : null
    }
}