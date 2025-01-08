import { Request , Response ,NextFunction } from "express"
import { LaborRepository } from "../repositories/implementaions/LaborRepository";
import { LaborAuthServies } from "../services/implementaions/LaborAuthServies";
import { ILaborAuthSerives } from "../services/interface/ILaborAuthServies";
export class AuthLaborController{
    private laborAuthservice: ILaborAuthSerives
    
    constructor() {
        const laborRepositoy = new LaborRepository()
        this.laborAuthservice = new LaborAuthServies(laborRepositoy)
    }

    public aboutYou = async (req: Request, res: Response, next: NextFunction) => {
         console.log('ima in backend')
        try {

            const {
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                address,
                dateOfBirth,
                gender,
                language
                        } = req.body; 
            
              console.log("Received form data:", {
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                address,
                dateOfBirth,
                gender,
                language
            });
               

              const laborer = await this.laborAuthservice.registerAboutYou({
                firstName,
                lastName,
                email,
                password,
                phone: phoneNumber,
                address,
                personalDetails: {
                    dateOfBirth,  // Nest dateOfBirth inside personalDetails
                    gender
                },
                language
            });
            
            return res.status(200).json({ success: true, data: laborer });

        } catch (error) {
             console.error("Error in aboutYou controller:", error);
            next(error)
            return res.status(500).json({ error: "Something went wrong. Please try again." });
        }    
    }
}

export default AuthLaborController;