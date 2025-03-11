import { IAuthService } from './../interface/IAuthservices';
import bcrypt from 'bcrypt'
import { IUser } from '../../controllers/entities/UserEntity';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import User from '../../models/userModel';
import { ApiError } from '../../middleware/errorHander';
import { generateAccessToken, generateRefreshToken ,accessTokenForReset , decodeAndVerifyToken} from '../../utils/tokenUtils';
import { error } from 'console';

export  class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async login(
    user: Partial<IUser>
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    userFound: Omit<IUser, "password">;
  } | null> {
    try {
      const userFound = await this.userRepository.LoginUser(
        user.email.toString()
      );

      // First check: User exists
      if (!userFound || !userFound.password) {
        throw new Error("Invalid Credentials");
      }

      // Second check: User blocked status
      if (userFound.isBlocked) {
        throw new Error("Your account has been blocked");
      }

      // Third check: Password validation
      const isPasswordValid = await bcrypt.compare(
        user.password,
        userFound.password
      );
      if (!isPasswordValid) {
        throw new Error("Incorrect Password..");
      }

      // Generate tokens only if all checks pass
      const accessToken = generateAccessToken({
        id: userFound.id,
        role: userFound.role,
      });

      const refreshToken = generateRefreshToken({
        id: userFound.id,
        role: userFound.role,
      });

      const userWithNewToken = await this.userRepository.saveRefreshToken(
        userFound.id,
        refreshToken
      );

      return {
        accessToken,
        refreshToken,
        userFound: userWithNewToken,
      };
    } catch (error) {
      throw new ApiError(500, "Server Error", error.message);
    }
  }

  async register(
    user: Partial<IUser>
  ): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        ...user,
        password: hashedPassword,
      });

      const createUser = await this.userRepository.createUser(newUser);

      console.log("User created in the database:", createUser);

      if (!createUser) {
        throw new ApiError(404, "Faild to register new user....!");
      }

      const accessToken = generateAccessToken({
        id: createUser.id,
        role: createUser.role,
      });

      const refreshToken = generateRefreshToken({
        id: createUser.id,
        role: createUser.role,
      });

      const userAfterSavedToken = await this.userRepository.saveRefreshToken(
        createUser.id,
        refreshToken
      );

      return {
        user: userAfterSavedToken,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error during registration in AuthService:", error);
      throw new ApiError(500, "Failed to register user.");
    }
  }

  async googleSignIn(
    user: Partial<IUser>
  ): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const useAfterSuccess = await this.userRepository.googleSignIn(user);

      if (!useAfterSuccess) {
        return null;
      }

      const userId =
        useAfterSuccess.id ||
        (useAfterSuccess.toObject && useAfterSuccess.toObject().id);

      if (!userId) {
        throw new Error("User ID is not available");
      }

      const accessToken = generateAccessToken({
        id: userId,
        role: useAfterSuccess.role,
      });
      const refreshToken = generateRefreshToken({
        id: userId,
        role: useAfterSuccess.role,
      });

      const userAfterSavedToken = await this.userRepository.saveRefreshToken(
        userId,
        refreshToken
      );

      return {
        user: userAfterSavedToken,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      return null;
    }
  }

  async findUserWithEmail(email: string): Promise<IUser | null> {
    try {
      const userFound = await this.userRepository.findByUserEmil(email);

      console.log("this is service userFound :", userFound);

      if (userFound) {
        return userFound;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error during forgotPasswordSendOTP:", error);
      return null;
    }
  }

  generateTokenForForgotPassword(user: Partial<IUser>): string {
    return accessTokenForReset(user);
  }

  decodeAndVerifyToken(token: string): Promise<Partial<IUser | null>> {
    try {
      const decode = decodeAndVerifyToken(token);

      return decode;
    } catch (error) {
      return null;
    }
  }

  async changePassword(password: string, email: string): Promise<IUser | null> {
    const hashPassword = await bcrypt.hash(password.toString(), 10);

    const userAfterUpdate = await this.userRepository.changePassword(
      hashPassword,
      email
    );

    return userAfterUpdate;
  }

  async logout(token: string, id: string): Promise<IUser | null> {
    const user = await this.userRepository.removeRefreshToken(id, token);
    return user ? user : null;
  }

  async checkIuserBlock(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepository.isBlockeduser(userId);
      return user;
    } catch (error) {
      console.error("Error in service while checking block status:", error);
      throw error;
    }
  }

  async refreshAccessToken(userId: string): Promise<string | null> {
    const UserFound = await this.userRepository.findById(userId);

    if (UserFound) {
      const id = UserFound._id?.toString();

      const accessToken = generateAccessToken({
        id,
        role: UserFound.role,
      });

      return accessToken;
    }

    return null;
  }
}