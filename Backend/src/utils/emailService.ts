import nodemailer from "nodemailer"
import { IUser } from "controllers/entities/UserEntity"

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

export const sendRejectionEmail = async (email: string, reason: string, userName: string): Promise<boolean> => {

    console.log('here is iam going to send the email : , ',email)
    console.log('here is iam going to send the userName : , ', userName)
    
    console.log('Frontend URL:', process.env.FRONTEND_URL);
    console.log('Reapply URL:', process.env.LABORREAPPY_URL);
 

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender's email address
            to: email,                    // Recipient's email address
            subject: 'Your Request Has Been Rejected', // Email subject
            html: `
                <p>Dear ${userName},</p>
                <p>We regret to inform you that your request has been rejected. The reason for rejection is as follows:</p>
                <p><strong>${reason}</strong></p>
                <p>If you have any questions or concerns, please feel free to contact us.</p>
                <p>We encourage you to <a href="${process.env.FRONTEND_URL}${process.env.LABORREAPPY_URL}">reapply</a> if you wish to proceed.</p>
                <p>Best regards,</p>
                <p>Your Team</p>
            `, // HTML body content
        }

        // Send the rejection email
        const info = await transporter.sendMail(mailOptions)

        console.log('Rejection email sent: ' + info.response)
        return true
    } catch (error) {
        console.error('Error sending rejection email:', error)
        return false
    }
}