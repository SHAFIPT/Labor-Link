import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../redux/store/store';
import { registUser, verifyOtp, resendOtp } from '../../services/UserAuthServices';
import {
  setLoading,
  setAccessToken,
  setIsAuthenticated,
  setError,
  setUser,
  setFormData
} from '../../redux/slice/userSlice'
import { toast } from 'react-toastify';
import './LoadingBody.css'
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';


const OtpForm = ({ isVisible, onClose }) => {
  
  const [timer, setTimer] = useState(60)
  const [otp, setOtp] = useState({ input1: '', input2: '', input3: '', input4: '' })
  const { formData, loading } = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState({ type: '', content: '', description: '' });
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (/^[0-9]?$/.test(value)) {
        setOtp((prev) => ({
        ...prev,
        [id] : value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const otpCode = `${otp.input1}${otp.input2}${otp.input3}${otp.input4}`;

    console.log('This is otpCode :', otpCode);
    console.log('this is the user formData :',formData)

  try {
    const VerifyOtpResponse = await verifyOtp(formData.email, otpCode);

    if (VerifyOtpResponse.status === 200) {
      toast.success('OTP Verified Successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      setTimeout(async () => {
        dispatch(setLoading(true));
        // Register the new user after the delay
        const registernewUser = await registUser(formData);
        console.log('User Registered Successfully:', registernewUser);

        if (registernewUser.data) {
          const { user, accessToken } = registernewUser.data;

          dispatch(setUser(user));
          dispatch(setAccessToken(accessToken));
          dispatch(setIsAuthenticated(true));
          dispatch(setFormData({}));
          navigate('/');

          toast.success('Registration Successful!', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          dispatch(setError(registernewUser));
          toast.error('Error during registration.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }

        setTimeout(() => {
          dispatch(setLoading(false));
        }, 3000);
      }, 2000); // 2 seconds delay
    } else {
      toast.error(
        VerifyOtpResponse.data?.message || 'Invalid OTP. Please try again.',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    }
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || 'An error occurred during OTP verification.',
      {
        position: 'top-right',
        autoClose: 3000,
      }
    );
  }
};


  useEffect(() => {
    if (isVisible && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [isVisible, timer])
  
  if (!isVisible) return null;
  

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(60)

      const otpResponse = await resendOtp(formData)

      if (otpResponse instanceof AxiosError) {
      toast.error(otpResponse.message);
    } else if (otpResponse?.data?.error) {
      toast.error(otpResponse.data.error);
    }
    }
  }

  const handleCloseMessage = () => {
    setMessage({ type: '', content: '', description: '' });
  };

  return (
    <StyledWrapper>

      {message.content && (
        <ErrorMessage message={message} onClose={handleCloseMessage} />
      )}

      {loading && (
        <div className="loader "></div>
    )}

      <div className="modal-overlay">
      <form className="otp-Form" onSubmit={handleSubmit}>
        <span className="mainHeading">Enter OTP</span>
        <p className="otpSubheading">We have sent a verification code to your email</p>
        <div className="inputContainer">
            <input
              required="required"
              maxLength={1}
              type="text"
              className="otp-input"
              id="input1"
              value={otp.input1}
              onChange={handleInputChange}
            />
            <input
              required="required"
              maxLength={1}
              type="text"
              className="otp-input
              " id="input2"
              value={otp.input2}
              onChange={handleInputChange}
            />
            <input
              required="required"
              maxLength={1}
              type="text"
              className="otp-input"
              id="input3"
              value={otp.input3}
              onChange={handleInputChange}
            />
            <input
              required="required"
              maxLength={1}
              type="text"
              className="otp-input"
              id="input4"
              value={otp.input4}
              onChange={handleInputChange}
            /> 
        </div>
        <button className="verifyButton" type="submit">Verify</button>
        <button className="exitBtn" onClick={onClose}>×</button>
          <p className="resendNote">
            {timer > 0 ? (
              `Resend available in ${timer}s`
            ) : (
              <button className="resendBtn" onClick={handleResend}>Resend Code</button>
            )}
          </p>
        {/* <p className="resendNote">Didn't receive the code? <button className="resendBtn">Resend Code</button></p> */}
      </form>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
 .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
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
