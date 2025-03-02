import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { toast } from 'react-toastify';
import { workCompletion } from '../../services/UserSurvice'
import { IBooking } from '../../@types/IBooking';
interface WorkCompleteModalProps {
  onClose: () => void; // onClose should be a function that takes no parameters and returns nothing
  bookingId: string;  // Assuming bookingId is a string (adjust if it's another type)
  onUpdateBooking: (reshedule: IBooking
  ) => void; // Assuming onUpdateBooking takes 'reshedule' as an argument
}

const WorkCompleteModal: React.FC<WorkCompleteModalProps> = ({ onClose, bookingId, onUpdateBooking }) => {
    const theme = useSelector((state: RootState) => state.theme.mode);
    const isUserAthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
    const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)

    
    const handleComplete = async () => {
        try {
           
            let updateData = {};

            if (isUserAthenticated) {
                updateData = {isUserCompletionReported: true}
            } else if (isLaborAuthenticated) {
                updateData = { isLaborCompletionReported: true };
            }

            console.log("uuuuuuuuuuuuuu",updateData)
            console.log("llllllllll",bookingId)
            
            const response = await workCompletion(updateData, bookingId)
            
          if (response.status === 200) {
            console.log('hellowww', response)
            const { reshedule } = response.data
            onUpdateBooking(reshedule)
                toast.success('work has been completd succesfully')
                onClose()
            } else {
                toast.error("Error occured in work completion")
            }
        
      } catch (error) {
        console.error(error)
        toast.error('errror in workcompletion ')
      }
  };

    const handleIncomplete = () => {
        onClose()
  };

  return (
  <>
  {theme === 'light' ? (
    // Light Theme Modal
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Work Complete Confirmation</h2>
          </div>

          {/* Content */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="font-medium text-gray-700 mb-2">Note:</p>
            <p className="text-gray-600">
              Are you sure the labor has completed the work fully and neatly?
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-full w-full sm:w-auto transition-colors"
            >
              Yes, Completed
            </button>
            <button
              onClick={handleIncomplete}
              className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-full w-full sm:w-auto transition-colors"
            >
              No, Incomplete
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    // Dark Theme Modal
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-40" onClick={onClose} />
  
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Work Complete Confirmation</h2>
          </div>
  
          {/* Content */}
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <p className="font-medium text-gray-300 mb-2">Note:</p>
            <p className="text-gray-400">
              Are you sure the labor has completed the work fully and neatly?
            </p>
          </div>
  
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-full w-full sm:w-auto transition-colors"
            >
              Yes, Completed
            </button>
            <button
              onClick={handleIncomplete}
              className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-full w-full sm:w-auto transition-colors"
            >
              No, Incomplete
            </button>
          </div>
        </div>
      </div>
    </>
  )}

  {/* Toast */}
  {/* {toast && (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  )} */}
</>

  );
};

export default WorkCompleteModal;
