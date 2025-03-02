import React, { useState } from "react";
import { XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { BookingDetails, updateSingleBooking } from "../../../redux/slice/bookingSlice";
import { toast } from "react-toastify";
import { submitAdditionalCharge } from "../../../services/LaborServices";


interface AdditionalChargeProps {
  onClose: () => void; 
  bookingId: string; 
  booking: BookingDetails; 
  onUpdateBooking: (updatedBooking: BookingDetails) => void;
}

const AdditionalCharge: React.FC<AdditionalChargeProps> = ({ onClose, bookingId, booking, onUpdateBooking }) => {
  const [formData, setFormData] = useState({
    amount: "", 
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await submitAdditionalCharge({ 
        bookingId, 
        amount: formData.amount, 
        reason: formData.reason 
      });
        
       if (response.status === 200) {
        const { additnalChageAdd } = response.data;
        
        // Restructure the data to match BookingDetails type
        const updatedBooking = {
            ...booking, // spread the existing booking
            additionalChargeRequest: additnalChageAdd.additionalChargeRequest,
            status: additnalChageAdd.status,
            updatedAt: additnalChageAdd.updatedAt
         };
         onUpdateBooking(updatedBooking)

        dispatch(updateSingleBooking(updatedBooking));
        toast.success("Additional charge added successfully");
        onClose();
        }
    } catch (error) {
      console.error("Error submitting additional charge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {theme == "light" ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-2/5 lg:w-1/3 max-w-lg">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Request Additional Charge
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  placeholder="Enter amount"
                  required
                />
              </div>

              {/* Reason Input */}
              <div className="space-y-2">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason for Additional Charge
                </label>
                <textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors h-32 resize-none"
                  placeholder="Explain why additional charge is needed..."
                  required
                />
              </div>

              {/* Important Note */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Additional charges will only be applied
                  after user approval. The original estimated cost will remain
                  unchanged until then.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.amount || !formData.reason}
                  className="flex-1 px-6 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-xl w-11/12 md:w-2/5 lg:w-1/3 max-w-lg">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  Request Additional Charge
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-300"
                >
                  Additional Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  placeholder="Enter amount"
                  required
                />
              </div>

              {/* Reason Input */}
              <div className="space-y-2">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-300"
                >
                  Reason for Additional Charge
                </label>
                <textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors h-32 resize-none"
                  placeholder="Explain why additional charge is needed..."
                  required
                />
              </div>

              {/* Important Note */}
              <div className="bg-yellow-900 p-4 rounded-lg">
                <p className="text-sm text-yellow-400">
                  <strong>Note:</strong> Additional charges will only be applied
                  after user approval. The original estimated cost will remain
                  unchanged until then.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.amount || !formData.reason}
                  className="flex-1 px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdditionalCharge;
