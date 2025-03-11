import React from 'react';
import { toast } from 'react-toastify';
import { acceptRequst, rejectRequst } from '../../services/LaborServices';
import { XCircle } from 'lucide-react';
import { BookingDetails } from '../../redux/slice/bookingSlice';

interface AdditionalChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails[];  // Array of booking details objects
  onUpdateBooking: (updatedBooking: BookingDetails) => void; // Function to update booking
}

const AdditionalChargeModal: React.FC<AdditionalChargeModalProps> = ({
  isOpen,
  onClose,
  bookingDetails,
  onUpdateBooking
}) => {
  if (!isOpen || !bookingDetails || bookingDetails.length === 0) return null;

    const additionalCharge = bookingDetails[0].additionalChargeRequest;
    
    const bookingId = bookingDetails[0].bookingId

    const handleAcceptRequest = async () => {
      try {
        const response = await acceptRequst(bookingId);

        if (response.status === 200) {
          const { acceptRequst } = response.data;
          onUpdateBooking(acceptRequst)
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
          const { rejectRequst } = response.data;
          onUpdateBooking(rejectRequst)
          toast.success("reshedule successfull");
          onClose();
        }
      } catch (error) {
        console.error(error);
        toast.error("error isn the resheduleRequstSend");
      }
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-6">
          Additional Charge Confirmation
        </h2>

        {/* Details */}
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            <span className="font-semibold">Additional Charge:</span> {additionalCharge?.amount}
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            <span className="font-semibold">Reason for the Charge:</span> {additionalCharge?.reason}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleAcceptRequest}
            className="px-5 py-2.5 text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-300 shadow-md"
          >
            Accept
          </button>
          <button
            onClick={handleRejectRequest}
            className="px-5 py-2.5 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalChargeModal;