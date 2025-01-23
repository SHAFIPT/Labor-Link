import bycript  from 'bcrypt';
import { IUserSideRepository } from "../../repositories/interface/IUserSideRepository";
import { IUserServices } from "../../services/interface/IUserServices";
import { IUser } from "../../entities/UserEntity";


export default class UserServices implements IUserServices{
    private userRepository: IUserSideRepository
    
    constructor(userRepository: IUserSideRepository) {
        this.userRepository = userRepository
    }

    async fetchUserDetails(userId: string): Promise<IUser | null> {
        return await this.userRepository.fetchUser(userId)
    }
    async UpdateUser(user: IUser): Promise<IUser | null> {
    return await this.userRepository.profileUpdate(user);
    }
    async updatePassword(email: string, password: string): Promise<IUser | null> {
        const bycriptPassword = await  bycript.hash(password, 10)
        return await this.userRepository.updatePassword(email, bycriptPassword)
    }
}