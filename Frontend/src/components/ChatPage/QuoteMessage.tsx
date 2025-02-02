const QuoteMessage = ({ message, isCurrentUser, formatTimestamp, participants, onAcceptQuote, isLabor }) => {
  const senderProfilePic = isLabor 
    ? participants.labor.profilePicture 
    : participants.user.profilePicture;

  return (
    <div className={`flex items-start gap-4 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
      <img
        src={senderProfilePic || '/default-avatar.png'}
        alt="Profile"
        className="w-10 h-10 rounded-full flex-shrink-0"
      />

      <div className={`flex flex-col gap-2 ${isCurrentUser ? "items-end" : "items-start"}`}>
        <div
          className={`p-4 rounded-lg shadow-md w-full sm:w-[300px] md:w-[400px] lg:w-[500px] flex flex-col ${
            isCurrentUser ? "bg-[#cdffcd]" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-green-500"
              >
                <path
                  fill="currentColor"
                  d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h16v12H4V6zm8 7c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-1.5c.83 0 1.5-.67 1.5-1.5S12.83 9 12 9s-1.5.67-1.5 1.5S11.17 11.5 12 11.5zM6 16h12v1H6v-1z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-black mb-2">
                {isCurrentUser
                  ? "Here is my quote for the job:"
                  : "You have received a quote from the laborer:"}
              </h3>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div>
              <span className="font-semibold text-[#6b2a2a]">Job details:</span>
              <p className="text-gray-600">{message.content.description}</p>
            </div>

            <div>
              <span className="font-semibold text-[#6b2a2a]">Estimated Cost:</span>
              <p className="text-gray-600">₹{message.content.estimatedCost}</p>
            </div>

            <div className="space-y-1">
            <span className="font-semibold text-[#6b2a2a]">Available Time:</span>
            <div className="flex flex-col text-gray-600">
              <p>
                <span className="inline-block w-5">
                  <i className="far fa-calendar" />
                </span>
                {new Date(message.content.arrivalTime).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p>
                <span className="inline-block w-5">
                  <i className="far fa-clock" />
                </span>
                {new Date(message.content.arrivalTime).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
          </div>

            {!isCurrentUser && message.content.status === "pending" && (
              <button
                onClick={() => onAcceptQuote(message.id, message.content)}
                className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Accept Quote
              </button>
            )}
          </div>
        </div>

        <span className="text-sm text-gray-500">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default QuoteMessage