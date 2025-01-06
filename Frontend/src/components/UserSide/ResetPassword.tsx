import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { setError } from '../../redux/slice/userSlice'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validatePassword } from '../../utils/userRegisterValidators'
import { toast } from 'react-toastify';

const ResetPassword = ({
    conform,
    title,
    message,
    onCancel
}) => {

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useDispatch()
    const error : { password?: string } = useSelector((state: RootState) => state.user.error);
    

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
        toast.success("Password reset successfully");
        onCancel();
        }

    }

   return (
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
              className="w-full px-3 text-black py-2 border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
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
            className="w-full px-3 text-black py-2 border border-orange-300 focus:outline-none rounded-md focus:border-orange-500"
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
  );
}

export default ResetPassword
