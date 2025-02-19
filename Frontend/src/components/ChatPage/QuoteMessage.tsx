import { Banknote, CalendarDays, Clock, FileText } from "lucide-react";

const QuoteMessage = ({ message, isCurrentUser, formatTimestamp, participants, onAcceptQuote, isLabor, isDisabled}) => {
  const senderProfilePic = isLabor 
    ? participants.labor.profilePicture 
    : participants.user.profilePicture;

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

            {/* Action Button */}
            {!isCurrentUser && message.content.status === "pending" && !isDisabled && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => onAcceptQuote(message.id, message.content)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 
                    transition-colors duration-200 font-medium focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:ring-offset-2 active:bg-green-800"
                >
                  Accept Quote
                </button>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="mt-2 text-xs text-gray-500 px-1">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteMessage