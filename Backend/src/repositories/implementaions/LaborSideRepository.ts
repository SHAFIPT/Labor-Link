import { IAboutMe, ILaborer } from "entities/LaborEntity";
import { ILaborSidRepository } from "../../repositories/interface/ILaborSideRepository";
import Labor from "../../models/LaborModel";

export class LaborSideRepository implements ILaborSidRepository {
  async fetchLabor(laborId: string): Promise<ILaborer | null> {
    return Labor.findById(laborId).select("-password -refreshToken");
  }
  async updateProfile(labor: Partial<ILaborer>): Promise<ILaborer | null> {
    try {
      if (!labor.email) {
        throw new Error("Email is required to update the profile.");
      }

      const updateLabor = await Labor.findOneAndUpdate(
        { email: labor.email },
        { $set: labor },
        { new: true }
      );

      return updateLabor;
    } catch (error) {
      console.error("Error updating labor profile:", error);
      throw error;
    }
    }
    async updatePassword(email: string, NewPassword: string): Promise<ILaborer | null> {
        return await Labor.findOneAndUpdate(
            { email }, // Query by email
            { $set: { password: NewPassword } }, // Update password field
            { new: true } // Return the updated document
        );
  }
  
  async fetchLabors(userLatandLog: { latitude: number; longitude: number; }): Promise<ILaborer[]> {

    console.log("thsi is the userLatndLog  latitude;  ++++------++++",userLatandLog.latitude)
    console.log("thsi is the userLatndLog longitude ; ++++++++******+++++++",userLatandLog.longitude)

    try {
      return await Labor.find({
        isApproved: true,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [userLatandLog.longitude, userLatandLog.latitude],
            },
            $maxDistance: 5000,
          }
        }    
      }).select('-password -refreshToken');
    } catch (error) {
      console.error('Error fetching laborers from database:', error);
      throw new Error('Failed to fetch laborers.');
    }
  }
  
 async aboutMe(data: { userId: string; name: string; experience: string; description: string; }): Promise<IAboutMe>  {
  try {
    const { userId, name, experience, description } = data;

    console.log("Thsi sthe user detials : ", {
      userId,
      name,
      description,
      experience
    })

    const labor = await Labor.findById(userId);

    console.log("Thsis itehlagbor in db : ",labor)

    if (!labor) { 
      throw new Error('Laborer not found');
    }

    // Check if 'aboutMe' already exists, then update or add new
    if (labor.aboutMe) {
      // Update existing aboutMe
      labor.aboutMe.name = name;
      labor.aboutMe.experience = experience;
      labor.aboutMe.description = description;
    } else {
      // Add new aboutMe
      labor.aboutMe = { name, experience, description };
    }

    await labor.save();
    

    return labor.aboutMe;
  } catch (error) {
    console.error(error);
    throw new Error('Error in aboutMe profile update');
  }
}
}