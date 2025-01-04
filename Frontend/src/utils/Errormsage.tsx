import React from 'react';
import './Errormsg.css';

const ErrorMessage = ({ message, onClose }) => {
  const icon =
    message.type === 'error' ? (
      // Red round cross icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-red-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ) : (
      // Success icon (green check)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    );

  // Set background color to black and icon color to red for error
  const alertColor = message.type === 'error' ? 'bg-black' : 'bg-green-500';
  const textColor = message.type === 'error' ? 'text-red-500' : 'text-white';
  const borderColor = message.type === 'error' ? 'border-red-700' : 'border-green-700';

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs">
      <div
        className={`error-alert cursor-default flex items-center justify-between w-full h-16 sm:h-18 rounded-lg border-2 ${borderColor} ${alertColor} px-4 py-3 shadow-lg`}
      >
        <div className="flex gap-3 items-center">
          <div
            className={`text-white p-2 rounded-full ${alertColor} bg-opacity-80 backdrop-blur-xl`}
          >
            {icon}
          </div>
          <div className="flex flex-col">
            <p className={`${textColor} font-semibold`}>{message.content}</p>
            {/* {message.description && (
              <p className="text-gray-200 mt-1">{message.description}</p>
            )} */}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-100 hover:bg-opacity-30 hover:bg-white/10 p-2 rounded-md transition-colors ease-linear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
