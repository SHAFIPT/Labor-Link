import React, { useState } from 'react'
import AnimatedPage from '../AnimatedPage/Animated';
import { emailValidate } from '../../utils/userRegisterValidators';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { setError } from '../../redux/slice/userSlice'
import { toast } from 'react-toastify';

const Forgottpasswod = ({
    conform,
    onCancel,
    message,
    title,
    onVerify
}) => {

    const error : { email?: string } = useSelector((state: RootState) => state.user.error);

    const [email, setEmail] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState(["", "", "", ""]);
    const dispatch = useDispatch()
    
    const handleConform = async () => {
        dispatch(setError(false))
        const error = emailValidate(email);
        
         if (error) {
        dispatch(setError(error));
        return toast.error(error.email);
        }

        const response = await conform(email)

        if (response) {
            setOtpSent(true)
        }
    }


    const handleOtpChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) { // Only allow single digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to next input if the current input has a value
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
    };  
    
    const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      return toast.error("OTP must be 4 digits");
    }
    onVerify(otpValue, email);
  };
 
  return (
    <>
  
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 opacity-100`}
    >
        <AnimatedPage>
      <div
       className={`bg-white rounded-lg shadow-lg max-w-md w-[400pc] p-6 transform transition-all duration-300 translate-y-0 opacity-100`}
      >
        <h2 className="text-lg font-semibold text-center text-gray-800">
          {title}
        </h2> 

        {!otpSent && (
          <div className="flex flex-col justify-center mt-2">
            <p className="text-gray-600 mt-2">{message}</p>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full text-black bg-white px-3 py-2 border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
            />
            {error?.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>
        )}

        {otpSent && (
          <div className="flex flex-col items-center justify-center mt-2">
            <p>Enter the 4-digit code sent to your email</p>
            <div className="flex justify-center space-x-2 mt-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  id={`otp-${index}`}
                  maxLength={1} // Limit each input to one character
                  className="w-10 h-10 bg-white text-black text-center border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex  justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ease-in-out"
          >
            Cancel
          </button>
          {otpSent ? (
            <button
              onClick={handleVerify}
              className="px-4 py-2 w-full bg-orange-500 text-white rounded hover:bg-orange-600 transition ease-in-out"
            >
              Verify
            </button>
          ) : (
            <button
              onClick={handleConform}
              className="px-4 py-2 w-full bg-orange-500 text-white rounded hover:bg-orange-600 transition ease-in-out"
            > 
            Conform
            </button>
          )}
        </div>
      </div>
      </AnimatedPage>
    </div>
 
    </>
  );

}

export default Forgottpasswod
