import mongoose, { Schema } from "mongoose";
import { IOTP } from "controllers/entities/OtpEntity";
import User from "./userModel";

const OTPSchema: Schema<IOTP> = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expirationTime: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    reSendCount: { type: Number, default: 0 },
    lastResendTime: { type: Date, default: null },
    role : {type : String , default : 'user'}
},
    {timestamps : true},
)

OTPSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 86400 });


export default mongoose.model<IOTP>('OTP', OTPSchema)