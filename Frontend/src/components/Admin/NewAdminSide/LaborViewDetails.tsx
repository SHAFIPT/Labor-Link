import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  Download,
  CheckCircle,
  XCircle,
  Star,
  FileText,
  Briefcase,
  Shield,
  Unlock,
  Lock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/slice/adminSlice";
import {
  Approve,
  blockLabor,
  fetchLaborAllBookings,
  rejection,
  UnblockLabor,
} from "../../../services/AdminAuthServices";
import "../../../components/Auth/LoadingBody.css";
import { toast } from "react-toastify";
import { RootState } from "../../../redux/store/store";
import { IBooking } from "../../../@types/IBooking";
import Pagination from "../../ui/pegination";
import { HttpStatus } from "../../../enums/HttpStaus";
import { Messages } from "../../../constants/Messages";

interface Certificate {
  url: string;
  name: string;
  certificateDocument?: string;
  issuedBy?: string;
  issueDate?: string;
}

interface LaborData {
  status: string;
  // Add other properties if needed
}

interface Labor {
  email: string;
  isBlocked: boolean;
}

interface LaborBlockButtonProps {
  labor: Labor;
  dispatch: (action: any) => void;
}

const LaborViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const labor = location.state;
  const laborId = labor?._id;
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [documentModal, setDocumentModal] = useState<Certificate | null>(null);
  const [localLabor, setLocalLabor] = useState(labor);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejfectModal, setRejectModal] = useState(false);
  const [laborData, setLaborData] = useState<LaborData>({
    status: "", // Initialize with a default value
  });
  const loading = useSelector((state: RootState) => state.admin.loading);
  const [bookingDetils, setBookingDetils] = useState<IBooking[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  // Calculate experience duration
  const calculateExperience = () => {
    if (!labor?.DurationofEmployment?.startDate) return "Not specified";

    const startDate = new Date(labor.DurationofEmployment.startDate);
    const currentDate = new Date(); // ✅ Corrected

    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime()); // ✅ Use .getTime() for subtraction
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );

    return `${diffYears} years, ${diffMonths} months`;
  };

  // Format the skills array properly
  const formatSkills = () => {
    if (!labor?.skill || !labor.skill.length) return [];

    try {
      // Handle the nested JSON structure
      if (
        typeof labor.skill[0] === "string" &&
        labor.skill[0].startsWith("[")
      ) {
        return JSON.parse(labor.skill[0]);
      }
      return labor.skill;
    } catch (error) {
      console.error(error);
      return labor.skill;
    }
  };
  useEffect(() => {
    const fetchLaborBooings = async () => {
      try {
        const response = await fetchLaborAllBookings(
          laborId,
          currentPage,
          limit,
          ""
        ); // Removed incorrect filter syntax
        if (response.status === HttpStatus.OK) {
          const { bookings, totalPages } = response.data;
          setTotalPages(totalPages);
          setBookingDetils(bookings);
        }
      } catch (error) {
        console.error(Messages.ERROR_FETCH_LABORS_BOOKINGS, error);
      }
    };

    fetchLaborBooings();
  }, [currentPage, limit, laborId]);

  const handleApprove = async () => {
    try {
      dispatch(setLoading(true));
      const response = await Approve({ email: labor.email });

      if (response.status === HttpStatus.OK) {
        const { isApproved } = response.data.labor;
        setLaborData((prev) => ({ ...prev, status: "approved" }));
        dispatch(setLoading(false));
        toast.success(
          `labor Approved succesfully ${
            isApproved ? "Approved" : "rejected the Approval"
          }`
        );
      } else {
        dispatch(setLoading(false));
        toast.error(Messages.ERROR_IN_APPROVAL);
      }
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
      toast.error(Messages.FAILD_TO_APPROVAL);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const resoponse = await rejection({
      reason: rejectionReason,
      email: labor.email,
    });
    if (resoponse.status === HttpStatus.OK) {
      setLaborData((prev) => ({ ...prev, status: "rejected" }));
      setRejectModal(false);
      dispatch(setLoading(false));
    } else {
      dispatch(setLoading(false));
      toast.error(Messages.ERROR_IN_REASON_SUBMISSION);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const viewDocument = (document: Certificate) => {
    setDocumentModal(document);
  };

  const closeModal = () => {
    setDocumentModal(null);
  };

  const downloadDocument = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

   const LaborBlockButton: React.FC<LaborBlockButtonProps> = ({ labor, dispatch }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleToggleBlock = async () => {
      dispatch(setLoading(true))
      try {
        setIsLoading(true);
        
        if (labor?.isBlocked) {
          // Unblock labor
          await dispatch(UnblockLabor({ email: labor.email }));
          setLocalLabor({...localLabor, isBlocked: false});
          dispatch(setLoading(false))
        } else {
          // Block labor
          await dispatch(blockLabor({ email: labor.email }));
          setLocalLabor({...localLabor, isBlocked: true});
          dispatch(setLoading(false))
        }
        
        // You might want to refresh the labor data here or show a success message
        dispatch(setLoading(false))
      } catch (error) {
        console.error("Error toggling block status:", error);
        dispatch(setLoading(false))
      }
    };

    return (
      <div className="px-6 py-4 border-t border-gray-700">
        <button
          onClick={handleToggleBlock}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            localLabor?.isBlocked
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : localLabor?.isBlocked ? (
            <>
              <Unlock size={18} />
              Unblock Labor
            </>
          ) : (
            <>
              <Lock size={18} />
              Block Labor
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      {loading && <div className="loader"></div>}
      {rejfectModal && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          {/* Modal */}
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="max-w-xl w-full mx-auto bg-gray-900 rounded-xl overflow-hidden">
              <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full">
                  <svg
                    viewBox="0 0 48 48"
                    height="100"
                    width="100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="24" cy="24" r="22" fill="#FF4D4D" />
                    <line
                      x1="16"
                      y1="16"
                      x2="32"
                      y2="32"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="16"
                      y1="32"
                      x2="32"
                      y2="16"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h4 className="text-xl text-gray-100 font-semibold mb-5">
                  Rejection Reason Submission
                </h4>
                <p className="text-gray-300 font-medium mb-4">
                  Please provide the reason for rejecting this request:
                </p>

                <textarea
                  className="w-full h-24 p-3 rounded-md bg-gray-800 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter the rejection reason here..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="pt-5 pb-6 px-6 text-right bg-gray-800 -mb-2">
                <button
                  onClick={() => setRejectModal(false)} // Close the modal
                  className="inline-block w-full sm:w-auto py-3 px-5 mb-2 mr-4 text-center font-semibold leading-6 text-gray-200 bg-gray-500 hover:bg-gray-400 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject} // Function to handle submission
                  className="inline-block w-full sm:w-auto py-3 px-5 mb-2 text-center font-semibold leading-6 text-blue-50 bg-green-500 hover:bg-green-600 rounded-lg transition duration-200"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={goBack}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold ml-4">Labor Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              {laborData?.status === "approved" ||
              labor.status === "approved" ? (
                // ✅ Approved UI
                <div className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg">
                  <CheckCircle size={18} />
                  <span>Approved</span>
                </div>
              ) : laborData?.status === "rejected" ||
                labor.status === "rejected" ? (
                // ✅ Rejected UI
                <div className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg">
                  <XCircle size={18} />
                  <span>Rejected</span>
                </div>
              ) : (
                // ✅ Approve / Reject Buttons
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRejectModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                  >
                    <XCircle size={18} />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                  >
                    <CheckCircle size={18} />
                    <span>Approve</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield
                  size={24}
                  className={
                    labor?.isApproved ? "text-green-400" : "text-yellow-400"
                  }
                />
                <div>
                  <h2 className="text-lg font-medium">Verification Status</h2>
                  <p className="text-gray-400">
                    Current stage: {labor?.currentStage || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex mt-4 md:mt-0 gap-4">
                <div className="px-4 py-2 rounded-lg bg-gray-700">
                  <span className="text-sm text-gray-400">
                    Profile Completion:
                  </span>
                  <span className="ml-2 font-medium">
                    {labor?.profileCompletion ? "Complete" : "Incomplete"}
                  </span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-gray-700">
                  <span className="text-sm text-gray-400">Account Status:</span>
                  <span
                    className={`ml-2 font-medium ${
                      labor?.isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {labor?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Labor Details Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Basic Info */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 lg:col-span-1">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-800 to-transparent"></div>
              </div>

              <div className="p-6 relative">
                {/* Profile Picture */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 ring-4 ring-gray-800 rounded-full">
                  <img
                    src={
                      labor?.profilePicture ||
                      "https://www.svgrepo.com/show/192247/man-user.svg"
                    }
                    alt="Profile"
                    className="w-28 h-28 rounded-full bg-gray-700 object-cover border-4 border-gray-800"
                  />
                </div>

                <div className="mt-16 text-center">
                  <h1 className="text-2xl font-bold mb-1">
                    {`${labor?.firstName || "John"} ${
                      labor?.lastName || "Doe"
                    }`}
                  </h1>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-blue-400">
                      {labor?.categories?.[0] || "Labor"}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 mr-1" />
                      <span>{labor?.rating || "0"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {labor?.isApproved ? (
                      <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock size={12} />
                        Pending Verification
                      </span>
                    )}

                    {labor?.isBlocked ? (
                      <span className="px-3 py-1 bg-red-900 text-red-300 rounded-full text-xs font-medium">
                        Blocked
                      </span>
                    ) : null}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Phone size={16} className="text-gray-400" />
                      <span>{labor?.phone || "Not provided"}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Mail size={16} className="text-gray-400" />
                      <span>{labor?.email || "Not provided"}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{`${labor?.address?.city || ""}, ${
                        labor?.address?.state || ""
                      }, ${
                        labor?.address?.country || "Location not provided"
                      }`}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block">
                <LaborBlockButton labor={labor} dispatch={dispatch} />      
              </div>
            </div>

            {/* Middle & Right Columns - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-400" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Date of Birth</p>
                    <p className="font-medium">
                      {labor?.personalDetails?.dateOfBirth
                        ? new Date(
                            labor.personalDetails.dateOfBirth
                          ).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Gender</p>
                    <p className="font-medium capitalize">
                      {labor?.personalDetails?.gender || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Preferred Language
                    </p>
                    <p className="font-medium">
                      {labor?.language || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Registration Date
                    </p>
                    <p className="font-medium">
                      {labor?.createdAt
                        ? new Date(labor.createdAt).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-purple-400" />
                  Professional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Experience</p>
                    <p className="font-medium">{calculateExperience()}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Currently Working
                    </p>
                    <p className="font-medium">
                      {labor?.DurationofEmployment?.currentlyWorking
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Availability</p>
                    <div className="flex flex-wrap gap-2">
                      {labor?.availability?.map(
                        (day: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 rounded-md text-xs capitalize"
                          >
                            {day}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Working Hours</p>
                    <p className="font-medium">{`${
                      labor?.startTime || "9:00"
                    } - ${labor?.endTime || "17:00"}`}</p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 text-sm mb-2">
                    Skills & Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formatSkills().map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Documents & Verification */}
          {/* Documents & Verification */}
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText size={20} className="text-green-400" />
                Documents & Verification
              </h2>

              {/* Government ID */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-300">
                  Government ID
                </h3>

                {labor?.governmentProof?.idDocument ? (
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-400">ID Type</p>
                        <p className="font-medium capitalize">
                          {labor.governmentProof.idType || "ID Document"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            viewDocument({
                              url: labor.governmentProof.idDocument,
                              name: `${labor.firstName}_${labor.governmentProof.idType}`,
                            })
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1 text-sm transition-colors"
                        >
                          <FileText size={16} />
                          View
                        </button>
                        <button
                          onClick={() =>
                            downloadDocument(
                              labor.governmentProof.idDocument,
                              `${labor.firstName}_${labor.governmentProof.idType}`
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-1 text-sm transition-colors"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-48 bg-gray-800 rounded overflow-hidden">
                      <img
                        src={labor.governmentProof.idDocument}
                        alt="ID Document"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 text-center">
                    <p className="text-gray-400">No ID document provided</p>
                  </div>
                )}
              </div>

              {/* Certificates */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-300">
                  Professional Certificates
                </h3>

                {labor?.certificates && labor.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {labor.certificates.map(
                      (cert: Certificate, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm text-gray-400">
                                Certificate Name
                              </p>
                              <p className="font-medium">
                                {cert.name || `Certificate ${index + 1}`}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  viewDocument({
                                    url: cert.certificateDocument || "",
                                    name:
                                      cert.name || `Certificate_${index + 1}`,
                                  })
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <FileText size={16} />
                                View
                              </button>
                              <button
                                onClick={() =>
                                  downloadDocument(
                                    cert.url,
                                    cert.name || `Certificate_${index + 1}`
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <Download size={16} />
                                Download
                              </button>
                            </div>
                          </div>
                          <div className="w-full h-40 bg-gray-800 rounded overflow-hidden">
                            <img
                              src={cert.certificateDocument}
                              alt={cert.name || `Certificate ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          {cert.issuedBy && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-400">Issued By</p>
                              <p className="text-sm">{cert.issuedBy}</p>
                            </div>
                          )}
                          {cert.issueDate && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-400">
                                Issue Date
                              </p>
                              <p className="text-sm">
                                {new Date(cert.issueDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 text-center">
                    <p className="text-gray-400">No certificates provided</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Modal */}
          {documentModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="font-medium text-lg">{documentModal.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        downloadDocument(documentModal.url, documentModal.name)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-1 text-sm transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto bg-gray-900 p-4 flex items-center justify-center">
                  <img
                    src={documentModal.url}
                    alt={documentModal.name}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Booking History */}
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-orange-400" />
                Booking History
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Booking ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Laborer
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Cost
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingDetils.length > 0 ? (
                      bookingDetils.map((booking, index) => (
                        <tr
                          key={booking._id}
                          className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-4 text-sm">{index + 1}</td>
                          <td className="px-4 py-4 text-sm">
                            {booking?.addressDetails?.name || "N/A"}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {booking?.quote?.arrivalTime
                              ? new Date(
                                  booking.quote.arrivalTime
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                booking.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } text-white`}
                            >
                              {booking.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            ₹{booking?.quote?.estimatedCost || "0"}/-
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full text-center ${
                                booking?.paymentStatus === "paid"
                                  ? "bg-green-500 text-white"
                                  : booking?.paymentStatus === "pending"
                                  ? "bg-yellow-500 text-black"
                                  : booking?.paymentStatus === "failed"
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                            >
                              {booking?.paymentStatus || "N/A"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-4 text-center text-gray-400"
                        >
                          No bookings available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="mt-4">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaborViewDetails;
