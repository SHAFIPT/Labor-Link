import React from 'react';
import { AlertCircle } from 'lucide-react';
import { QuoteDetailsType } from './ChatComponets';

interface QuoteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quoteDetails: QuoteDetailsType | null;
}


const QuoteConfirmationModal: React.FC<QuoteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  quoteDetails,
}) => {
    if (!isOpen) return null;
    
      console.log("This is the selected Queet4e leeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",quoteDetails)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg max-w-[600px] w-full p-6 shadow-xl">
        {/* Icon and Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Confirm Quote Acceptance</h2>
          <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-gray-600">
            Are you sure to accept the quote? If it so you can continue to book the labor otherwise just reject this quote.
          </p>
        </div>

        {/* Quote Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Cost:</span>
              <span className="font-semibold text-black">₹{quoteDetails?.estimatedCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Arrival Time:</span>
              <span className="font-semibold text-black">
                {quoteDetails?.arrivalTime 
                  ? new Date(quoteDetails.arrivalTime).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-5 rounded-full bg-[#85301d] text-white hover:bg-[#632618] transition-colors"
          >
            Back to chat
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-5 bg-[#21A391] text-white rounded-full hover:bg-[#13584f] transition-colors"
          >
            Book the labor and continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteConfirmationModal;