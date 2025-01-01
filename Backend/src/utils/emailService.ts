import nodemailer from "nodemailer"
import { IUser } from "entities/UserEntity"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export const sendEmailOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender's email address
            to: email,                    // Recipient's email address
            subject: 'Your OTP Code',     // Email subject
            html: `<p>Your OTP code is: <strong>${otp}</strong></p>`, // HTML body content
        };
        const info = await transporter.sendMail(mailOptions)

        console.log('Email sent: ' + info.response)
        return true;

    } catch (error) { 
        console.error('Error sending email:', error);
        return false;  
    }
}