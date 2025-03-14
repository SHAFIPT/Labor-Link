import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { setError } from '../../redux/slice/userSlice'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validatePassword } from '../../utils/userRegisterValidators'
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../utils/firbase"; // Import your Firebase instance
import { FirebaseError } from 'firebase/app';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success icon
import { motion } from "framer-motion"; // For smooth animations

interface ResetPasswordProps {
    conform: (password: string) => Promise<boolean>; // Typing conform function to return a Promise
    title: string;
    message: string;
    onCancel: () => void;
    email: string;
}

const ResetPassword = ({
    conform,
    title,
    message,
    onCancel,
    email
}: ResetPasswordProps) => {
     const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useDispatch()
    const error : { password?: string } = useSelector((state: RootState) => state.user.error);
    const theam = useSelector((state: RootState) => state.theme.mode);
    

    const handleConfirm = async () => {
        dispatch(setError(false))

        const error = validatePassword(password)

        if (error) {
      dispatch(setError(error));
      return toast.error(error.password);
    }    

        if (password !== confirmPassword) {
            dispatch(setError({ password: "Passwords do not match" }));
            return toast.error("Passwords do not match");
        }

        const response = await conform(password);


      if (response) {
        await handleFirebasePasswordReset(email);
        setOpenModal(true);
        }

  }
  
     const handleFirebasePasswordReset = async (userEmail : string) => {
        // Ensure email is properly formatted and validated
        if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
            toast.error("Valid email is required for Firebase password reset");
            return;
        }
        
        try {
            // Send Firebase password reset email
            await sendPasswordResetEmail(auth, userEmail.trim());
            toast.info("A password reset email has been sent to your email address. Please check your inbox to complete the Firebase authentication update.");
         } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            // Now TypeScript knows that error has a 'code' property
            console.error("Failed to send Firebase password reset email:", error);

            if (error.code === 'auth/invalid-email') {
                toast.error("The email address format is not valid. Please check your email.");
            } else if (error.code === 'auth/user-not-found') {
                toast.info("If you haven't used Firebase login before, you may need to create an account first.");
            } else {
                toast.warning("There was an issue sending the password reset email. You may need to use the 'Forgot Password' option at login if you have trouble signing in.");
            }
        } else {
            // Handle other errors that aren't Firebase errors
            toast.error("An unexpected error occurred. Please try again later.");
        }
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  

  return (
     <>
      {theam === "light" ? (
              <>
                {openModal && (
                  <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                      sx: {
                        borderRadius: "12px",
                        p: 2,
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ textAlign: "center", p: 3 }}
                    >
                      {/* Animated Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 60, color: "#4CAF50" }} />
                      </motion.div>
      
                      {/* Title */}
                      <DialogTitle
                        sx={{ fontSize: "20px", fontWeight: "600", mt: 2 }}
                      >
                        Password Reset Email Sent
                      </DialogTitle>
      
                      {/* Message */}
                      <DialogContent>
                        <Typography
                          variant="body1"
                          sx={{ color: "#555", fontSize: "16px", mt: 1 }}
                        >
                          A password reset link has been sent to your email. Please
                          check your inbox and set your new password.
                        </Typography>
                      </DialogContent>
      
                      {/* Button */}
                      <DialogActions sx={{ mt: 2 }}>
                        <Button
                          onClick={handleCloseModal}
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(135deg, #007BFF 0%, #0056D2 100%)",
                            color: "white",
                            borderRadius: "8px",
                            px: 4,
                            "&:hover": { background: "#0056D2" },
                          }}
                        >
                          OK
                        </Button>
                      </DialogActions>
                    </Box>
                  </Dialog>
                )}
              </>
            ) : (
              <>
                {openModal && (
                  <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                      sx: {
                        borderRadius: "12px",
                        p: 2,
                        bgcolor: "#1E1E1E", // Dark mode background
                        color: "#E0E0E0", // Light text for dark mode
                        boxShadow: "0px 4px 30px rgba(0, 255, 128, 0.3)",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ textAlign: "center", p: 3 }}
                    >
                      {/* Animated Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 60, color: "#4CAF50" }} />
                      </motion.div>
      
                      {/* Title */}
                      <DialogTitle
                        sx={{
                          fontSize: "20px",
                          fontWeight: "600",
                          mt: 2,
                          color: "#E0E0E0",
                        }}
                      >
                        Password Reset Email Sent
                      </DialogTitle>
      
                      {/* Message */}
                      <DialogContent>
                        <Typography
                          variant="body1"
                          sx={{ color: "#B0B0B0", fontSize: "16px", mt: 1 }}
                        >
                          A password reset link has been sent to your email. Please
                          check your inbox and set your new password.
                        </Typography>
                      </DialogContent>
      
                      {/* Button */}
                      <DialogActions sx={{ mt: 2 }}>
                        <Button
                          onClick={handleCloseModal}
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(135deg, #0044CC 0%, #002A80 100%)",
                            color: "white",
                            borderRadius: "8px",
                            px: 4,
                            "&:hover": { background: "#003399" },
                          }}
                        >
                          OK
                        </Button>
                      </DialogActions>
                    </Box>
                  </Dialog>
                )}
              </>
            )}
     
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 `}
    >
      <div
        className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-300 `}
      >
        <h2 className="text-lg font-semibold text-center text-gray-800">
          {title}
        </h2>
        <p className="text-gray-600 mt-2">{message}</p>

        <div className="flex flex-col justify-center mt-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 bg-white text-black py-2 border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error?.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
          )}
        </div>

        <div className="flex flex-col justify-center mt-4">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-3 bg-white text-black py-2 border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 w-full bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 w-full bg-orange-500 text-white rounded hover:bg-orange-600 transition ease-in-out"
           >
             confirm
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default ResetPassword
