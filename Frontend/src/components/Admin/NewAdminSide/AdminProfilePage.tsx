import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  resetUser,
  setAccessToken,
  setFormData,
  setisUserAthenticated,
  setUser,
} from "../../../redux/slice/userSlice";
import {
  resetLaborer,
  setIsLaborAuthenticated,
  setLaborer,
} from "../../../redux/slice/laborSlice";
import { persistor } from "../../../redux/store/store";
import { toast } from "react-toastify";
import { logout } from "../../../services/AdminAuthServices";
import { useDispatch } from "react-redux";
import {
  resetAdmin,
  setAdmin,
  setIsAdminAuthenticated,
} from "../../../redux/slice/adminSlice";
import { HttpStatus } from "../../../enums/HttpStaus";
import { Messages } from "../../../constants/Messages";

const AdminProfilePage = () => {
  const admin = {
    name: "Admin",
    role: "Administrator",
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response?.status === HttpStatus.OK) {
        // Clear all auth-related data
        localStorage.removeItem("UserAccessToken");
        localStorage.removeItem("LaborAccessToken");
        localStorage.removeItem("AdminAccessToken");
        // persistor.purge();
        dispatch(setAdmin({}));
        dispatch(resetAdmin());
        dispatch(setIsAdminAuthenticated(false));
        dispatch(setFormData({}));

        // Reset User State
        dispatch(setUser({}));
        dispatch(setFormData({}));
        dispatch(resetUser());
        dispatch(setisUserAthenticated(false));
        dispatch(setAccessToken(""));

        // Reset Labor State
        dispatch(setLaborer({}));
        dispatch(resetLaborer());
        dispatch(setIsLaborAuthenticated(false));

        // Clear persisted state
        await persistor.purge();

        toast.success(Messages.LOGOUT_SUCCESSFUL);
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Container with responsive padding */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Main card - responsive sizing */}
        <div className="bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Header gradient accent */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

          <div className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-10 -mt-12 sm:-mt-16">
            {/* Profile section */}
            <div className="flex flex-col items-center">
              {/* Admin Icon with ring effect */}
              <div className="relative">
                <div className="bg-gray-800 rounded-full p-4 border-4 border-gray-900 shadow-xl">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-4">
                    <User size={48} className="text-white" />
                  </div>
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-1 right-1 bg-emerald-500 h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-gray-800"></div>
              </div>

              {/* Admin details - responsive text sizes */}
              <div className="text-center mt-4 sm:mt-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {admin.name}
                </h1>
                <div className="flex items-center justify-center mt-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 mr-2"></span>
                  <p className="text-indigo-300 text-sm sm:text-base">
                    {admin.role}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full my-6 sm:my-8"></div>

              {/* Logout Button - responsive sizing */}
              <button
                onClick={handleLogout}
                className="flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/20 font-medium"
              >
                <LogOut className="mr-2" size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
