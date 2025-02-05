import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../redux/slice/userSlice";
import { RootState } from "../../redux/store/store";
import { validateNewDate, validateNewTime, validateReason } from "../../utils/userRegisterValidators";
import { toast } from "react-toastify";
import '../Auth/LoadingBody.css'
import { setBookingDetails, updateSingleBooking } from "../../redux/slice/bookingSlice";
import { handleRescheduleWork } from "../../services/UserSurvice";

const ResheduleModal = ({ onClose, bookingId }) => {
  

  console.log("Thsi is the bookingId.....",bookingId)

  const dispatch = useDispatch()
  const [reshedulDatas, setReshedulDatas] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });
   const error: {
    newDate?: string;
    newTime?: string;
    reason?: string;
    } = useSelector((state: RootState) => state.user.error);  
    const loading  = useSelector((state: RootState) => state.user.loading)
    const theam = useSelector((state: RootState) => state.theme.mode)
    const isUserAthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
    const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)


  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setReshedulDatas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const requestSentBy = isUserAthenticated ? "user" : isLaborAuthenticated ? "labor" : null

  const handleReschedule = async (e) => {
    e.preventDefault();
    const validateErrors = {
      newDate: validateNewDate(reshedulDatas.newDate),
      newTime: validateNewTime(reshedulDatas.newTime),
      reason: validateReason(reshedulDatas.reason),
    };
    dispatch(setError(validateErrors));
    if (!validateErrors.newDate && !validateErrors.newTime && !validateErrors.reason) {
        
        try {

            console.log("this is the reschedule.......................eeeeeee",reshedulDatas)
            console.log("this is the bookingId......................eeeeeee",bookingId)
            const resheduleResponse = await handleRescheduleWork({
                ...reshedulDatas,
                bookingId,
                requestSentBy
            })

          if (resheduleResponse.status === 200) {
            const { reshedule } = resheduleResponse.data
            
            console.log("TTTTTHAAAAANIVIRAAAAAAAAAAAAA:",reshedule)
              // dispatch(setBookingDetails(resheduleResponse.data.reshedule))
                dispatch(updateSingleBooking(reshedule));
                toast.success("reshedule successfull")
                onClose();
            }


        } catch (error) {
            console.error(error)
            toast.error('error isn the resheduleRequstSend')
        }

      
    }
  };

  return (
    <>
      {loading && <div className="loader"></div>}
      {theam == "light" ? (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Reschedule Work
            </h2>

            <div className="space-y-4">
              {/* New Date Field */}
              <div>
                <label
                  htmlFor="newDate"
                  className="block text-sm font-medium text-gray-600"
                >
                  New Date:
                </label>
                <input
                  id="newDate"
                  name="newDate"
                  type="date"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={reshedulDatas.newDate}
                  onChange={handleChangeInput}
                />
                {error?.newDate && (
                  <p className="text-red-500 text-sm mt-1">{error.newDate}</p>
                )}
              </div>

              {/* New Time Field */}
              <div>
                <label
                  htmlFor="newTime"
                  className="block text-sm font-medium text-gray-600"
                >
                  New Time:
                </label>
                <input
                  id="newTime"
                  name="newTime"
                  type="time"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={reshedulDatas.newTime}
                  onChange={handleChangeInput}
                />
                {error?.newTime && (
                  <p className="text-red-500 text-sm mt-1">{error.newTime}</p>
                )}
              </div>

              {/* Reason for Reschedule */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-600"
                >
                  Reason for Reschedule:
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={reshedulDatas.reason}
                  onChange={handleChangeInput}
                  rows="4"
                  placeholder="Please provide a reason for the reschedule."
                />
                {error?.reason && (
                  <p className="text-red-500 text-sm mt-1">{error.reason}</p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-4">
              <p>
                Note: The time will only be rescheduled once the labor accepts
                the new schedule request.
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-full hover:bg-gray-500 transition-colors"
                onClick={onClose}
              >
                Back to Page
              </button>
              <button
                className="bg-[#f39c12] text-white px-6 py-2 rounded-full hover:bg-[#e67e22] transition-colors"
                onClick={handleReschedule}
              >
                Send Request to Labor
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">
              Reschedule Work
            </h2>

            <div className="space-y-4">
              {/* New Date Field */}
              <div>
                <label
                  htmlFor="newDate"
                  className="block text-sm font-medium text-gray-400"
                >
                  New Date:
                </label>
                <input
                  id="newDate"
                  name="newDate"
                  type="date"
                  className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reshedulDatas.newDate}
                  onChange={handleChangeInput}
                />
                {error?.newDate && (
                  <p className="text-red-400 text-sm mt-1">{error.newDate}</p>
                )}
              </div>

              {/* New Time Field */}
              <div>
                <label
                  htmlFor="newTime"
                  className="block text-sm font-medium text-gray-400"
                >
                  New Time:
                </label>
                <input
                  id="newTime"
                  name="newTime"
                  type="time"
                  className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reshedulDatas.newTime}
                  onChange={handleChangeInput}
                />
                {error?.newTime && (
                  <p className="text-red-400 text-sm mt-1">{error.newTime}</p>
                )}
              </div>

              {/* Reason for Reschedule */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-400"
                >
                  Reason for Reschedule:
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reshedulDatas.reason}
                  onChange={handleChangeInput}
                  rows="4"
                  placeholder="Please provide a reason for the reschedule."
                />
                {error?.reason && (
                  <p className="text-red-400 text-sm mt-1">{error.reason}</p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-400 mt-4">
              <p>
                Note: The time will only be rescheduled once the labor accepts
                the new schedule request.
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors"
                onClick={onClose}
              >
                Back to Page
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                onClick={handleReschedule}
              >
                Send Request to Labor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResheduleModal;
