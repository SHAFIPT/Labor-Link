import React from "react";
import { CheckCircle } from "lucide-react"; // Success icon
import { useNavigate } from "react-router-dom";

const SuccessModal = ({ successModal, setSuccessModal }) => {
  const navigate = useNavigate();

  if (!successModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] text-center">
        {/* Success Icon */}

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">Successfully Booked</h2>

        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4 mt-4" />
        {/* Message */}
        <p className="text-gray-600 mt-2">
          You have successfully booked this labor. Now you can check the status in your profile page.
        </p>

        {/* Go to Profile Button */}
        <button
          className="mt-4 bg-[#21A391] text-white px-6 py-4 rounded-full hover:bg-[#217468]"
          onClick={() => {
            setSuccessModal(false);
            navigate("/userProfilePage"); // Navigate to profile page
          }}
        >
          Go to Profile Page & Check Details
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
