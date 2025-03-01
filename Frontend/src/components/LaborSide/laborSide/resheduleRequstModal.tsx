import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { validateNewDate, validateNewTime, validateReason } from '../../../utils/userRegisterValidators';
import { setError } from '../../../redux/slice/laborSlice';
import { toast } from 'react-toastify';
import { setBookingDetails, updateSingleBooking } from '../../../redux/slice/bookingSlice';
import { acceptReshedule, rejectReshedule } from '../../../services/LaborServices';

const RescheduleRequestModal = ({ 
  isOpen, 
  onClose,
  bookingDetails,
  onUpdateBooking
}) => {

    console.log("This is the bookingDetails;;;;;;;;;;;;;;", bookingDetails)
    

    

    const rescheduleInfo = bookingDetails?.[0]?.reschedule;
    const bookingId = bookingDetails?.[0]?.bookingId;
    console.log("VVVVVVVVVVVVVVVVVVVVVVVVV",bookingId)
    const [showRejectionForm, setShowRejectionForm] = useState(false);
    const theme = useSelector((state: RootState) => state.theme.mode);
    const bookingDetailss = useSelector((state: RootState) => state.booking.bookingDetails);
    const isUserAthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
    const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)
    // const [updatedBooking , setUpdatedBooking] = useState(null)
    console.log("iaaaaaaaaaaaaaaa heeeeeeeeeeeeeee",bookingDetailss)
    const loading  = useSelector((state: RootState) => state.labor.loading)
    const dispatch = useDispatch()
    const [rejectionData, setRejectionData] = useState({
        newTime: '',
        newDate: '',
        rejectionReason: ''
    });
    const error: {
        newDate?: string;
        newTime?: string;
        reason?: string;
  } = useSelector((state: RootState) => state.labor.error);  
  
  console.log('Thsi is the erroro ;;;;',error)

  useEffect(() => {
     console.log('Kyu3333333333333333333333333llllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$$############################')
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
    
  const rejectedBy = isUserAthenticated ? "user" : isLaborAuthenticated ? "labor" : null;
  const acceptedBy = isUserAthenticated ? "user" : isLaborAuthenticated ? "labor" : null;
  const requestSentBy = isUserAthenticated ? "user" : isLaborAuthenticated ? "labor" : null

  const handleRejectionSubmit = async (e) => {
    e.preventDefault();
    console.log('Rejection submitted:', rejectionData);
    const validateErrors = {
        newTime : validateNewTime(rejectionData.newTime),
        newDate : validateNewDate(rejectionData.newDate),
        rejectionReason : validateReason(rejectionData.rejectionReason)
    }    
    dispatch(setError(validateErrors));
      if (!validateErrors.newDate && !validateErrors.newTime && !validateErrors.rejectionReason) {
          try {
            //   const rejectedBy = 'labor'
              const response = await rejectReshedule({...rejectionData , bookingId , rejectedBy , requestSentBy})

              if (response.status === 200) {
                  console.log("This si tthe repns...............", response)
                  
                  const {reshedule} = response.data
                  console.log("This si tthe reshedule...PPPPPPPPPPPP............", reshedule)
                  // dispatch(setBookingDetails(reshedule))
                onClose()
                onUpdateBooking(reshedule);
                  toast.success('Rejeect submitted succesfully....')
              }
            
          } catch (error) {
            console.error(error)
            toast.error('error isn the rejectReshedule')
          }
       }
    // onClose();
  };
    const handleAcceptRequst = async () => {
      try {
        const response = await acceptReshedule(bookingId , acceptedBy);

        if (response.status === 200) {
          const { reshedule } = response.data
          
          console.log("Thanveeeeeeeeraaaaaaaaaaaaaa>>>>>>", reshedule)
          onUpdateBooking(reshedule);
          // dispatch(updateSingleBooking(reshedule))
          onClose();
          toast.success("reshedule requst accepted succesfully....");

        }
      } catch (error) {
        console.error(error);
        toast.error("error isn the Accept reshedule.....");
      }
    };



  if (!isOpen) return null;

  return (
      <>
    {loading && <div className="loader"></div>}  
    {theme === 'light' ? (
        
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="relative w-full max-w-lg bg-white p-8 rounded-xl shadow-xl transform transition-all duration-300 ease-out scale-100 opacity-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Reschedule Request</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!showRejectionForm ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-5 shadow-md">
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-sm font-medium">New Time:</span>
                <span className="text-sm font-medium text-gray-900">{rescheduleInfo?.newTime}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-sm font-medium">New Date:</span>
                <span className="text-sm font-medium text-gray-900">{new Date(rescheduleInfo?.newDate).toLocaleDateString()}</span>
              </div>
              <div className="pt-4 text-sm text-gray-700">
                <span className="font-medium">Reason:</span>
                <p className="mt-2">{rescheduleInfo?.reasonForReschedule}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRejectionForm(true)}
                className="px-6 py-3 bg-red-100 text-red-600 rounded-md border border-red-300 hover:bg-red-200 transition-colors"
              >
                Reject
              </button>
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleAcceptRequst}
              >
                Accept
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRejectionSubmit} className="space-y-6">
            <div>
              <label htmlFor="newTime" className="block text-sm font-medium text-gray-700">New Time</label>
              <input
                id="newTime"
                type="time"
                value={rejectionData.newTime}
                onChange={(e) => setRejectionData({...rejectionData, newTime: e.target.value})}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {error?.newTime && (
                  <p className="text-red-500 text-sm mt-1">{error.newTime}</p>
              )}
            </div>

            <div>
              <label htmlFor="newDate" className="block text-sm font-medium text-gray-700">New Date</label>
              <input
                id="newDate"
                type="date"
                value={rejectionData.newDate}
                onChange={(e) => setRejectionData({...rejectionData, newDate: e.target.value})}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {error?.newDate && (
                  <p className="text-red-500 text-sm mt-1">{error.newDate}</p>
                )}
            </div>

            <div>
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">Reason for Rejection</label>
              <textarea
                id="rejectionReason"
                value={rejectionData.rejectionReason}
                onChange={(e) => setRejectionData({...rejectionData, rejectionReason: e.target.value})}
                rows={4}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {error?.reason && (
                  <p className="text-red-500 text-sm mt-1">{error.reason}</p>
                )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowRejectionForm(false)}
                className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    ):(
   <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex justify-center items-center">
  <div className="relative w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-xl transform transition-all duration-300 ease-out scale-100 opacity-100">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Reschedule Request</h2>
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    {/* Content */}
    {!showRejectionForm ? (
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-700 p-5 shadow-md">
          <div className="flex justify-between items-center text-gray-300">
            <span className="text-sm font-medium">New Time:</span>
            <span className="text-sm font-medium text-white">{rescheduleInfo?.newTime}</span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span className="text-sm font-medium">New Date:</span>
            <span className="text-sm font-medium text-white">{new Date(rescheduleInfo?.newDate).toLocaleDateString()}</span>
          </div>
          <div className="pt-4 text-sm text-gray-300">
            <span className="font-medium">Reason:</span>
            <p className="mt-2">{rescheduleInfo?.reasonForReschedule}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowRejectionForm(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-md border border-red-500 hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={handleAcceptRequst}
          >
            
            Accept
          </button>
        </div>
      </div>
    ) : (
      <form onSubmit={handleRejectionSubmit} className="space-y-6">
        <div>
          <label htmlFor="newTime" className="block text-sm font-medium text-gray-200">New Time</label>
          <input
            id="newTime"
            type="time"
            value={rejectionData.newTime}
            onChange={(e) => setRejectionData({...rejectionData, newTime: e.target.value})}
            className="w-full mt-2 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {error?.newTime && (
                  <p className="text-red-500 text-sm mt-1">{error.newTime}</p>
              )}
        </div>

        <div>
          <label htmlFor="newDate" className="block text-sm font-medium text-gray-200">New Date</label>
          <input
            id="newDate"
            type="date"
            value={rejectionData.newDate}
            onChange={(e) => setRejectionData({...rejectionData, newDate: e.target.value})}
            className="w-full mt-2 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {error?.newDate && (
             <p className="text-red-500 text-sm mt-1">{error.newDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-200">Reason for Rejection</label>
          <textarea
            id="rejectionReason"
            value={rejectionData.rejectionReason}
            onChange={(e) => setRejectionData({...rejectionData, rejectionReason: e.target.value})}
            rows={4}
            className="w-full mt-2 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {error?.reason && (
            <p className="text-red-500 text-sm mt-1">{error.reason}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowRejectionForm(false)}
            className="px-6 py-3 text-gray-300 bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
          <button 
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    )}
  </div>
</div>

        
    )}
    </>
  );
};

export default RescheduleRequestModal;
