import { Timestamp as FirebaseTimestamp } from 'firebase/firestore';
import { Banknote, CalendarDays, Clock, FileText, X } from "lucide-react";
import { useState } from "react";
import { Message, QuoteDetailsType } from "./ChatComponets";

// interface Timestamp {
//   toDate(): Date;
//   seconds: number;
//   nanoseconds: number;
// }


interface QuoteMessageProps {
  message: Message & { content: QuoteDetailsType }; // Enforce that content is QuoteDetailsType
  isCurrentUser: boolean;
  formatTimestamp: (timestamp: FirebaseTimestamp | Date | null | undefined) => string;
  participants: {
    labor: { profilePicture: string };
    user: { profilePicture: string };
  };
  onAcceptQuote: (messageId: string, quoteDetails: QuoteDetailsType) => void;
  onRejectQuote: (messageId: string, rejectionReason: string) => Promise<void>;
  isLabor: boolean;
  isDisabled: boolean;
}


const QuoteMessage: React.FC<QuoteMessageProps> = ({
  message,
  isCurrentUser,
  formatTimestamp,
  participants,
  onAcceptQuote,
  isLabor,
  isDisabled,
  onRejectQuote,
}) => {
  const senderProfilePic = isLabor 
    ? participants.labor.profilePicture 
    : participants.user.profilePicture;
  
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    onRejectQuote(message.id, rejectionReason);
    setShowRejectModal(false);
    setRejectionReason("");
  };

    const convertTimestamp = (timestamp?: number | Date): FirebaseTimestamp | Date | null | undefined => {
      if (timestamp === undefined) return undefined;
      if (timestamp === null) return null;
      
      // If it's a Date object, just return it
      if (timestamp instanceof Date) return timestamp;
      
      // If it's a number, convert to Date
      if (typeof timestamp === 'number') return new Date(timestamp);
      
      // Default fallback
      return undefined;
    };


  return (
    <div className="max-w-3xl mx-auto">
      <div className={`flex items-start gap-6 p-4 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Profile Picture */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={senderProfilePic || '/api/placeholder/48/48'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-2xl">
          <div className={`rounded-xl shadow-sm border border-gray-200 overflow-hidden
            ${isCurrentUser ? "bg-blue-50" : "bg-white"}`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {isCurrentUser ? "Your Quote" : "Quote Received"}
              </h3>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-6">
              {/* Job Description */}
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Job Description</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {message.content.description}
                  </p>
                </div>
              </div>

              {/* Cost Estimate */}
              <div className="flex items-start gap-4">
                <Banknote className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Estimated Cost</p>
                  <p className="text-xl font-semibold text-green-600">
                    ₹{message.content.estimatedCost.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Date and Time Group */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Available Date */}
                <div className="flex items-start gap-4">
                  <CalendarDays className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Available Date</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(message.content.arrivalTime).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Available Time */}
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Available Time</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(message.content.arrivalTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

             {message.content.status === "rejected" && (
              <div className="px-6 py-4 bg-red-50 border-t border-red-100">
                <div className="space-y-2">
                  <h4 className="text-red-600 font-medium">Quote Rejected</h4>
                  <p className="text-red-700 text-sm">
                    Reason: {message.content.rejectionReason}
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            {!isCurrentUser && message.content.status === "pending" && !isDisabled && (
              <>
              <div className="px-6 py-4 bg-gray-50 border-t space-x-4 flex border-gray-200">
                <button
                  onClick={() => onAcceptQuote(message.id, message.content)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 
                    transition-colors duration-200 font-medium focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:ring-offset-2 active:bg-green-800"
                >
                  Accept Quote
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 
                    transition-colors duration-200 font-medium focus:outline-none focus:ring-2 
                    focus:ring-red-500 focus:ring-offset-2 active:bg-red-800"
                >
                  Reject Quote
                </button>
              </div>
              </>
            )}
          </div>

          {/* Timestamp */}
          <div className="mt-2 text-xs text-gray-500 px-1">
           {formatTimestamp(convertTimestamp(message.timestamp))}
          </div>
        </div>
      </div>

        {showRejectModal && (
       <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 transform transition-all scale-100">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-xl font-semibold text-gray-800">Reject Quote</h3>
            <button
              onClick={() => setShowRejectModal(false)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Textarea */}
          <div className="mt-4">
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full h-32 p-3 border text-black border-gray-300 rounded-lg focus:ring-2 
                focus:ring-gray-500 focus:border-gray-500 resize-none outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-5">
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>

      )}
    </div>
  );
};

export default QuoteMessage