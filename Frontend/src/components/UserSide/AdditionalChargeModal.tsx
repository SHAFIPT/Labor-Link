import React from 'react';
import { toast } from 'react-toastify';
import { updateSingleBooking } from '../../redux/slice/bookingSlice';
import { useDispatch } from 'react-redux';
import { acceptRequst, rejectRequst } from '../../services/LaborServices';

const AdditionalChargeModal = ({ isOpen, onClose, bookingDetails }) => {
    const dispatch = useDispatch()
  if (!isOpen || !bookingDetails || bookingDetails.length === 0) return null;

    const additionalCharge = bookingDetails[0].additionalChargeRequest;

    console.log("ttttttttttttttttttttttt", bookingDetails[0].bookingId)
    
    const bookingId = bookingDetails[0].bookingId
    

    const handleAcceptRequest = async () => {
      try {
        const response = await acceptRequst(bookingId);

        if (response.status === 200) {
          const { reshedule } = response.data;

          console.log("TTTTTHAAAAANIVIRAAAAAAAAAAAAA:", reshedule);
          // dispatch(setBookingDetails(resheduleResponse.data.reshedule))
          dispatch(updateSingleBooking(reshedule));
          toast.success("reshedule successfull");
          onClose();
        }
      } catch (error) {
        console.error(error);
        toast.error("error isn the resheduleRequstSend");
      }
    };
    const handleRejectRequest = async () => {
      try {
        const response = await rejectRequst(bookingId);
        if (response.status === 200) {
          const { reshedule } = response.data;

          console.log("TTTTTHAAAAANIVIRAAAAAAAAAAAAA:", reshedule);
          // dispatch(setBookingDetails(resheduleResponse.data.reshedule))
          dispatch(updateSingleBooking(reshedule));
          toast.success("reshedule successfull");
          onClose();
        }
      } catch (error) {
        console.error(error);
        toast.error("error isn the resheduleRequstSend");
      }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Additional Charge Confirmation
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Additional Charge:</span> {additionalCharge.amount}
            </p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Reason for the Charge:</span> {additionalCharge.reason}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleAcceptRequest}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            Accept It
          </button>
          <button
             onClick={handleRejectRequest}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Reject It
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalChargeModal;