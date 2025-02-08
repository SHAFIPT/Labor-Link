import { Request , Response ,NextFunction } from "express"
import { LaborRepository } from "../repositories/implementaions/LaborRepository";
import { LaborAuthServies } from "../services/implementaions/LaborAuthServies";
import { ILaborAuthSerives } from "../services/interface/ILaborAuthServies";
import cloudinary from "../utils/CloudineryCongif";
import formidable from 'formidable';
import { ApiError } from "../middleware/errorHander";
import ApiResponse from "../utils/Apiresponse";
import { ILaborer } from "./entities/LaborEntity";


export class AuthLaborController {
  private laborAuthservice: ILaborAuthSerives;

   options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict" as const,
        maxAge: 24 * 60 * 60 * 1000,
    };
   
  constructor() {
    const laborRepositoy = new LaborRepository();
    this.laborAuthservice = new LaborAuthServies(laborRepositoy);
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const labor = req.body
      console.log('thsi is the loogged labor :', labor)
      
      const response = await this.laborAuthservice.login(labor)

      console.log('Thsis is the repsose from labor login :', response)
      
      if (response?.LaborFound?.isBlocked) {
        return res.status(401).json({message :"Your account has been blocked"})
            // throw new ApiError(401, "Account Blocked", "Your account has been blocked");
      }
      
      if (response) {
        res.status(200)
          .cookie("LaborRefreshToken", response.refreshToken, this.options)
          .json(new ApiResponse(200, response))
      } else {
         console.log('this is the errorr')
          return res.status(400).json(new ApiError(400, "Invalid Credentials"));
      }
      
    } catch (error) {
       console.error("Error in labor login:", error);
      next(error);
    }
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
        location,
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
        location,
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
        location,
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

            const parsedAvailability = JSON.parse(field.availability[0]);

            console.log('this is parsedAvailability :  ++++++======&&&&&^^^#####3333', parsedAvailability)

            const response = await this.laborAuthservice.registerProfile({
                profilePicture: imageUrl,
                categories : category,
                skill : skill,
                startTime : startTime[0],
                endTime : endTime[0],
                availability: parsedAvailability,
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

 public experiencePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      // Handle ID Image
      const idImageFile = files.idImage?.[0];
      let idImageUrl = "";
      if (idImageFile) {
        try {
          const result = await cloudinary.uploader.upload(idImageFile.filepath, {
            folder: "labor_experience/id_documents",
          });
          idImageUrl = result.secure_url;
        } catch (error) {
          console.error("Error uploading ID image:", error);
          return res.status(500).json({ error: "Failed to upload ID image" });
        }
      }

      // Handle Certificate Images
      const certificateImageFiles = files.certificateImages || [];
      let certificateUrls: string[] = [];

      for (const certificateFile of certificateImageFiles) {
        try {
          const result = await cloudinary.uploader.upload(certificateFile.filepath, {
            folder: "labor_experience/certificate",
          });
          certificateUrls.push(result.secure_url);
        } catch (error) {
          console.error("Error uploading certificate image:", error);
          continue;
        }
      }

      // Parse certificates data from JSON string
      const certificates = JSON.parse(fields.certificates[0] || '[]');

      // Combine certificate URLs with certificate data
      const completeCertificates = certificates.map((cert: any, index: number) => ({
        certificateDocument: certificateUrls[index] || '',
        certificateName: cert.certificateName,
        lastUpdated: new Date()
      }));

      const {
        startDate,
        responsibility,
        currentlyWorking,
        email,
        idType,
      } = fields;

      // Create the experience data object
      const experienceData = {
        governmentProof: {
          idDocument: idImageUrl,
          idType: idType[0],
        },
        certificates: completeCertificates,
        DurationofEmployment: {
          startDate: startDate[0],
          currentlyWorking: currentlyWorking[0] === 'true',
        },
        responsibility: responsibility[0],
        email: email[0],
      };

      console.log('Experience Data:', experienceData);

         const response = await this.laborAuthservice.registerExperience(experienceData);

      if (response) {
        const laborData = { ...response.labor.toObject() }; // Convert to plain object

        // Remove sensitive fields
        delete laborData.password;
        delete laborData.refreshToken;


        console.log("Thsi sithe labordeata ++++_________++++++++",laborData)

        return res.status(200)
          .cookie("LaborRefreshToken", response.refreshToken, this.options) // HTTP-only cookie for refresh token
          .json({
            success: true,
            message: "Experience data saved successfully",
            data: {
              ...experienceData,
              certificateUrls,
              accessToken: response.accessToken, // Include access token here
              laborData, // Include the labor data
            },
          });
      } else {
        return res.status(400).json({ 
          error: 'Error occurred during ExperiencePage submission!' 
        });
      }
    });
  } catch (error) {
    console.error("Error in experiencePage controller:", error);
    next(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
  
  public logoutLabor = async ( req: Request & { labor: { rawToken: string; id: string } }, res: Response , next : NextFunction) => {
    try {

       const { labor } = req;

      console.log("this is labor  ", labor);

     if (!labor) {
     return res.status(400).json({
        success: false, 
        message: 'User ID is required',
      });
    }
      
      const logoutLabor = await this.laborAuthservice.logout(labor.rawToken, labor.id)
      
      if (logoutLabor) {
        res.status(200).clearCookie("LaborRefreshToken").json({message : 'Labor Logout successfully....!'})
      }
      
    } catch (error) {
      console.error("Error in labor logout :", error);
      next(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
   public forgetPassword = async (req: Request, res: Response) => {
    try {
        
      const { email } = req.body
      console.log('htis is the emialof laboer :',email)
        

        const isUserExists = await this.laborAuthservice.findUserWithEmail(email)


        if (!isUserExists || isUserExists?.isBlocked) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        isUserExists?.isBlocked
                            ? "Account is blocked"
                            : "Check Your Email"
                    )
                );
        }

        const ResendOTPResponse = await this.laborAuthservice.sendForgetOtp(req.body);

        if (ResendOTPResponse) {
            return res.status(200).json({ message: "OTP sent successfully" });
        } else {
            return res.status(500).json({ message: "Error occurred during forgotPasswordSendOTP" });
        }

    } catch (error) {
        console.error("Resend OTP Error:", error.message || error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
    }
    
    public forgetVerifyOtp = async (req: Request, res: Response) => {
        try {

            const { email, otp } = req.body;

            const isUserExists = await this.laborAuthservice.findUserWithEmail(email)

            if (!isUserExists || isUserExists?.isBlocked) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        isUserExists?.isBlocked
                            ? "Account is blocked"
                            : "Check Your Email"
                    )
                );
            }

            
            const OTPVerification = await this.laborAuthservice.isVerify(isUserExists , req.body)

            
            if (!OTPVerification) {
                return res.status(500).json(new ApiError(500, "Entered Wrong OTP"));
            } 

            const { password, refreshToken, ...user } = isUserExists;

            const accessToken = this.laborAuthservice.generateTokenForForgotPassword(user);

            return res
                .status(200)
                .cookie("userOtpAccessToken", accessToken)
                .json(
                new ApiResponse(200, { accessToken }, "OTP Verified Successfully")
                );

            
        } catch (error) {
            console.error("forgetPasswordVerify otp errror:", error.message || error);
            return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }

    public resetPassword = async (req: Request, res: Response) => {
        try {

            const { password, token } = req.body;
            

            const decode = await this.laborAuthservice.decodeAndVerifyToken(token);
            req.body.user = decode;


            if (!decode) {
                return res
                .status(405)
                .json(new ApiResponse(405, null, "Session Expired Try Again"));
            }

            const user = decode as { _doc: Partial<ILaborer> };

            const email = user._doc?.email;

            // console.log('i got the email :',email)
            // console.log('here the details of user :',req.body.user)

            const isUserExists = await this.laborAuthservice.findUserWithEmail(email)
            

            if (!isUserExists ) {
                return res
                .status(400)
                .json(
                    new ApiResponse(
                    400,
                    null,
                    ) 
                );
            }


             const passwordUpdated = await this.laborAuthservice.changePassword(
                password,
                email
            );



             if (passwordUpdated) {
                return res
                .status(200)
                .json(new ApiResponse(200, null, "reset success"));
            }

            return res
                .status(500)
                .json(new ApiError(500, "something went wrong", "reset Failed"));

            
        } catch (error) {
            console.error("reset new Password  errror:", error.message || error);
            return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }
     public refreshAccessToken = async (req:Request & {labor: {rawToken: string, id: string}} ,res:Response)=>{

        const {labor} = req

 

        const accessToken = await this.laborAuthservice.refreshAccessToken(labor.id)

        if(accessToken){
          return res.status(200)
          .json(
            new ApiResponse(
              200,
              {accessToken},
              "token Created Successfully"
            )
          )
        }

        
      }
}

export default AuthLaborController;