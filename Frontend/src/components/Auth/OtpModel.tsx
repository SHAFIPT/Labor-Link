import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../redux/store/store';
import { registUser, verifyOtp, resendOtp } from '../../services/UserAuthServices';
import { createUserWithEmailAndPassword  ,fetchSignInMethodsForEmail  } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions for saving data
import {auth , db} from '../../utils/firbase'
import {
  setLoading,
  setAccessToken,
  setisUserAthenticated,
  setError,
  setUser,
  setFormData
} from '../../redux/slice/userSlice'
import { toast } from 'react-toastify';
import './LoadingBody.css'
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { resetLaborer, setIsLaborAuthenticated } from '../../redux/slice/laborSlice';
import { HttpStatus } from '../../enums/HttpStaus';
import { Messages } from '../../constants/Messages';

interface OtpFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ isVisible, onClose }) => {
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { formData, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOtpChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (!formData.email) {
      toast.error("Email is required for OTP verification.");
      return;
    }

    try {
      const VerifyOtpResponse = await verifyOtp(formData.email, otpCode);

      if (!VerifyOtpResponse) {
        throw new Error("Invalid response from server.");
      }

      if (VerifyOtpResponse.status === HttpStatus.OK) {
        toast.success(Messages.OTP_VARIFIED_SUCCESSFULLY, {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(async () => {
          dispatch(setLoading(true));

          // Before creating a user, check if the email is already in use
          try {
            if (!formData.email) {
              toast.error("Email is required for register in firebase.");
              return;
            }
            const signInMethods = await fetchSignInMethodsForEmail(
              auth,
              formData.email
            );

            // If the email is already in use, Firebase will return an array with sign-in methods
            if (signInMethods.length > 0) {
              toast.error(
                "Email is already in use. Please try logging in or use a different email.",
                {
                  position: "top-right",
                  autoClose: 3000,
                }
              );
              dispatch(setLoading(false)); // Stop loading
              return; // Exit the function early
            }

            if (!formData.password) {
              toast.error("password is required for OTP verification.");
              return;
            }

            // Firebase Email/Password Sign-Up if email is not in use
            const firebaseUserCredential = await createUserWithEmailAndPassword(
              auth,
              formData.email,
              formData.password
            );

            const { user } = firebaseUserCredential;

            const DEFAULT_PROFILE_PICTURE =
              "https://res.cloudinary.com/dni3mqui7/image/upload/v1741595871/user_profiles/zc75ffpiqbyhfxvh1c6f.avif";

            // Save user data to Firestore
            const userData = {
              email: formData.email,
              name: formData.firstName || "", // Default name if not provided
              profilePicture:  DEFAULT_PROFILE_PICTURE, // Default empty string if no profile picture
              role: "user", // Default role for chat users
            };

            try {
              await setDoc(doc(db, "Users", user.uid), userData);

              // Save user data in MongoDB (if required)
              const registernewUser = await registUser(formData);

              if (!registernewUser || !registernewUser.data) {
                throw new Error(
                  "Invalid response from server during registration."
                );
              }

              if (registernewUser.data) {
                const { user, accessToken } = registernewUser.data.data;

                localStorage.setItem("UserAccessToken", accessToken);
                dispatch(resetLaborer());
                dispatch(setIsLaborAuthenticated(false));
                dispatch(setUser(user));
                dispatch(setAccessToken(accessToken));
                dispatch(setisUserAthenticated(true));
                dispatch(setFormData({}));
                navigate("/");

                toast.success("Registration Successful!", {
                  position: "top-right",
                  autoClose: 3000,
                });
              } else {
                dispatch(setError(registernewUser));
                toast.error("Error during registration.", {
                  position: "top-right",
                  autoClose: 3000,
                });
              }
            } catch (error) {
              console.error("Error saving user data to Firestore:", error);
              toast.error("Error occurred while saving user data.", {
                position: "top-right",
                autoClose: 3000,
              });
            }
          } catch (firebaseError) {
            console.error("Firebase Error:", firebaseError);

            // Ensure firebaseError is an instance of Error before accessing message
            const errorMessage =
              firebaseError instanceof Error
                ? firebaseError.message
                : "Firebase error occurred during registration.";

            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          }

          setTimeout(() => {
            dispatch(setLoading(false));
          }, 3000);
        }, 2000); // 2 seconds delay
      } else {
        toast.error(
          VerifyOtpResponse.data?.message || "Invalid OTP. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      console.error(error);

      let errorMessage = "An error occurred during OTP verification.";

      // If error is an Axios error, extract response message
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      // If error is a generic Error, extract message
      else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (isVisible && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible, timer]);

  if (!isVisible) return null;

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(60);

      const otpResponse = await resendOtp(formData);

      if (otpResponse instanceof AxiosError) {
        toast.error(otpResponse.message);
      } else if (otpResponse?.data?.error) {
        toast.error(otpResponse.data.error);
      }
    }
  };

  return (
    <StyledWrapper>
      {loading && <div className="loader "></div>}

      <div className="modal-overlay fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">

        <form
          className="otp-Form bg-white p-6 rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <span className="mainHeading text-xl font-semibold">Enter OTP</span>
          <p className="otpSubheading text-gray-600">
            We have sent a verification code to your email
          </p>
          <div className="flex flex-col items-center justify-center mt-2">
            <div className="flex justify-center space-x-2 mt-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  id={`otp-${index}`}
                  maxLength={1}
                  className="w-10 h-10 bg-white text-black text-center border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
                />
              ))}
            </div>
          </div>
          <button
            className="verifyButton bg-orange-500 text-white px-2 py-2 rounded-md mt-4 p-3"
            type="submit"
          >
            Verify
          </button>
          <button
            className="exitBtn absolute top-2 right-2 text-xl"
            onClick={onClose}
          >
            ×
          </button>
          <p className="resendNote text-gray-600 mt-4">
            {timer > 0 ? (
              `Resend available in ${timer}s`
            ) : (
              <button
                className="resendBtn text-blue-500"
                onClick={handleResend}
              >
                Resend Code
              </button>
            )}
          </p>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
//  .modal-overlay {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100vw;
//     height: 100vh;
//     background-color: rgba(0, 0, 0, 0.5);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 1000;
//   }
  .otp-Form {
    width: 330px;
    height: 360px;
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 30px;
    gap: 20px;
    position: relative;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.082);
    border-radius: 15px;
  }

  .mainHeading {
    font-size: 1.1em;
    color: rgb(15, 15, 15);
    font-weight: 700;
  }

  .otpSubheading {
    font-size: 0.7em;
    color: black;
    line-height: 17px;
    text-align: center;
  }

  .inputContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .otp-input {
    background-color: rgb(228, 228, 228);
    width: 50px;
    height: 50px;
    text-align: center;
    border: none;
    border-radius: 7px;
    caret-color: rgb(127, 129, 255);
    color: rgb(44, 44, 44);
    outline: none;
    font-weight: 600;
  }

  .otp-input:focus,
  .otp-input:valid {
    background-color: rgba(127, 129, 255, 0.199);
    transition-duration: .3s;
  }

  .verifyButton {
    width: 100%;
    height: 30px;
    border: none;
    background-color: rgb(127, 129, 255);
    color: white;
    font-weight: 600;
    cursor: pointer;
    border-radius: 10px;
    transition-duration: .2s;
  }

  .verifyButton:hover {
    background-color: rgb(144, 145, 255);
    transition-duration: .2s;
  }

  .exitBtn {
    position: absolute;
    top: 5px;
    right: 5px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.171);
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: none;
    color: black;
    font-size: 1.1em;
    cursor: pointer;
  }

  .resendNote {
    font-size: 0.7em;
    color: black;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .resendBtn {
    background-color: transparent;
    border: none;
    color: rgb(127, 129, 255);
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 700;
  }`;

export default OtpForm;
