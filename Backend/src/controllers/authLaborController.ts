import { Request , Response ,NextFunction } from "express"
import { LaborRepository } from "../repositories/implementaions/LaborRepository";
import { LaborAuthServies } from "../services/implementaions/LaborAuthServies";
import { ILaborAuthSerives } from "../services/interface/ILaborAuthServies";
import cloudinary from "../utils/CloudineryCongif";
import formidable from 'formidable';


export class AuthLaborController {
  private laborAuthservice: ILaborAuthSerives;

  constructor() {
    const laborRepositoy = new LaborRepository();
    this.laborAuthservice = new LaborAuthServies(laborRepositoy);
  }

  public aboutYou = async (req: Request, res: Response, next: NextFunction) => {
    console.log("ima in backend");
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
        language,
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
        language,
      });

      const laborer = await this.laborAuthservice.registerAboutYou({
        firstName,
        lastName,
        email,
        password,
        phone: phoneNumber,
        address,
        personalDetails: {
          dateOfBirth, // Nest dateOfBirth inside personalDetails
          gender,
        },
        language,
      });

      return res.status(200).json({ success: true, data: laborer });
    } catch (error) {
      console.error("Error in aboutYou controller:", error);
      next(error);
      return res
        .status(500)
        .json({ error: "Something went wrong. Please try again." });
    }
  };
  
  public profilePage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => { 
      console.log('iam  here see ;')
      const {email} = req.body

       console.log('this is email : ',email)
    const form =  formidable();

    form.parse(req, async (err, field, files) => {
      if (err) {
        console.error("Error parsing form data :", err);
        return res.status(500).json({ error: "Errror parse form data..." });
      }

        const imageFile = files.image ? files.image[0] : null;
        
        console.log('this is image file is back end :',imageFile)
      if (imageFile) {
        try {

            const result = await cloudinary.uploader.upload(imageFile.filepath,{folder : 'labor_profiles'})

            console.log('this is image result :', result)
            
            const imageUrl = result.secure_url;
        
            console.log('this is the image url to save :', imageUrl)
            
            const { category, skill, startTime, endTime, availability ,email } = field;

            console.log('this is category :',category)
            console.log('this is skill :',skill)
            console.log('this is startTime :',startTime)
            console.log('this is endTime :',endTime)
            console.log('this is availability :', availability)
            console.log('this is email :', email)

            const parsedAvailability = JSON.parse(availability[0]);

            console.log('this is parsedAvailability :', parsedAvailability)

            const response = await this.laborAuthservice.registerProfile({
                profilePicture: imageUrl,
                categories : category,
                skill : skill[0],
                startTime : startTime[0],
                endTime : endTime[0],
                availability,
                email : email[0]
            })
            console.log('resoponse from backend :', response)
            if (response) {
               return res.status(200).json({   
                success: true, data: response 
            }); 
            } else {
                return res.status(400).json({ error: 'error occurred ducing profile page submisingon...' });
            }

        } catch (error) {
          console.error("Error in profile controller:", error);
          next(error);
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Error uploading image to Cloudinary.' });
        }
      } else {
          return res.status(400).json({ error: 'Image is required.' });
      }
    });
  };
}

export default AuthLaborController;