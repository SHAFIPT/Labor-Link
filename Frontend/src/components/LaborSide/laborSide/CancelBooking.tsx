import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import {
  validateComments,
  validateEmail,
  validateFirstName,
  validatePhoneNumbers,
  validatePlace,
  validateReason,
} from "../../../utils/laborRegisterValidators"
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { setError, setLoading } from '../../../redux/slice/laborSlice';
import { RootState } from '../../../redux/store/store';
import '../../Auth/LoadingBody.css'
import { cancelSubmision } from '../../../services/LaborServices';
import { setBookingDetails } from '../../../redux/slice/bookingSlice';

interface CancelBookingFormProps {
  onClose: () => void; // Function type
  bookingId: string; // String type
}

// Use the interface for props in the component
const CancelBookingForm: FC<CancelBookingFormProps> = ({ onClose, bookingId }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.user.loading);
  const [cancelFormData, setCancelFormData] = useState({
    name: "",
    email: "",
    phone: "",
    place: "",
    reason: "",
    comments: "",
    isWithin30Minutes: false,
  });
  const error: {
    name?: string;
    email?: string;
    phone?: string;
    place?: string;
    reason?: string;
    comments?: string;
  } = useSelector((state: RootState) => state.labor.error) ?? {}

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  const newValue = type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value;

  setCancelFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};

  const handleSubmit = async  (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));

    // Validate all fields
    const validationErrors = {
      name: validateFirstName(cancelFormData.name),
      email: validateEmail(cancelFormData.email),
      phone: validatePhoneNumbers(cancelFormData.phone),
      place: validatePlace(cancelFormData.place),
      reason: validateReason(cancelFormData.reason),
      comments: validateComments(cancelFormData.comments),
    };

    // Check if there are any validation errors
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== null
    );

    if (hasErrors) {
      dispatch(setError(validationErrors));
      toast.error("Please fix the errors in the form before submitting.");
      dispatch(setLoading(false));
      return;
    }
    try {
      const cancelResponse = await cancelSubmision({
        ...cancelFormData,
        bookingId,
      });

      if (cancelResponse.status === 200) {
        toast.success("The cancel form is successfully submitted...");
        dispatch(setBookingDetails(cancelResponse.data.booking))
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in the cancel submission ....");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCloseModal = () => {
    dispatch(setError({}));
    onClose();
  };

  return (
    <>
      {loading && <div className="loader"></div>}

      <div className="fixed -inset-7 bg-black bg-opacity-50 z-10 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg mb-7 p-6 w-full max-w-md md:max-w-lg lg:max-w-md mx-auto overflow-y-auto max-h-[calc(100vh-1rem)] sm:max-w-full sm:h-auto">
          <h2 className="text-xl sm:text-lg text-black font-bold mb-4 text-center">
            Cancel Booking Form
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            We understand that circumstances may arise, requiring you to cancel
            your upcoming appointment. Please complete this form to inform us of
            the cancellation.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={cancelFormData.name}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md sm:p-3"
                required
              />
              {error?.name && (
                <p className="text-red-500 text-sm mt-1">{error.name}</p>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={cancelFormData.email}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md sm:p-3"
                required
              />
              {error?.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={cancelFormData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md sm:p-3"
                required
              />
              {error?.phone && (
                <p className="text-red-500 text-sm mt-1">{error.phone}</p>
              )}

              <input
                type="text"
                name="place"
                placeholder="Place"
                value={cancelFormData.place}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md sm:p-3"
                required
              />
              {error?.place && (
                <p className="text-red-500 text-sm mt-1">{error.place}</p>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please select a reason for canceling:
                </label>
                <select
                  name="reason"
                  value={cancelFormData.reason}
                  onChange={handleInputChange}
                  className="w-full p-2 border text-black border-gray-300 rounded-md sm:p-3"
                  required
                >
                  <option value="" disabled>
                    Select a reason
                  </option>
                  <option value="Emergency">Emergency</option>
                  <option value="Scheduling Conflict">
                    Scheduling Conflict
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {error?.reason && (
                <p className="text-red-500 text-sm mt-1">{error.reason}</p>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (optional)
                </label>
                <textarea
                  name="comments"
                  value={cancelFormData.comments}
                  onChange={handleInputChange}
                  className="w-full p-2 border text-black border-gray-300 rounded-md sm:p-3"
                  rows={3}
                />
              </div>
              {error?.comments && (
                <p className="text-red-500 text-sm mt-1">{error.comments}</p>
              )}

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isWithin30Minutes"
                    checked={cancelFormData.isWithin30Minutes}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    I am canceling within 30 minutes of the scheduled time.
                  </span>
                </label>
                {cancelFormData.isWithin30Minutes && (
                  <p className="text-sm text-red-600 mt-2">
                    Note: A cancellation fee will be applied for cancellations
                    within 30 minutes.
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors w-1/2 sm:w-auto"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-[#A32121] text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-1/2 sm:w-auto"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CancelBookingForm;