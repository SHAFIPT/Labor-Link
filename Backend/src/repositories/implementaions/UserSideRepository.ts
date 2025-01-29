import { IUser } from "../../entities/UserEntity";
import { IUserSideRepository } from "../../repositories/interface/IUserSideRepository";
import User from "../../models/userModel";
import { ApiError } from "../../middleware/errorHander";
import { IBooking } from "entities/bookingEntity";
import { v4 as uuidv4 } from 'uuid';
import Booking from "../../models/BookingModal";


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
    async createBooking(bookingDetails: Partial<IBooking>): Promise<IBooking | null> {
    try {
        if (!bookingDetails.quote?.description || !bookingDetails.quote?.estimatedCost || !bookingDetails.quote?.arrivalTime) {
            throw new Error('Missing required quote fields');
        }

        console.log('This is the CreateBooooking ;;;;;;;;;;;;;;;',bookingDetails)

        const bookingId = uuidv4();

        const newBooking = new Booking({
            bookingId,
            userId: bookingDetails.userId,
            laborId: bookingDetails.laborId,
            quote: {
                description: bookingDetails.quote.description,
                estimatedCost: bookingDetails.quote.estimatedCost,
                arrivalTime: bookingDetails.quote.arrivalTime
            },
            status: 'confirmed',
            paymentStatus: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("This is the newBokkkoioooooooooooooonng , ",newBooking)

        const savedBooking = await newBooking.save();
        return savedBooking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
    }
}

}