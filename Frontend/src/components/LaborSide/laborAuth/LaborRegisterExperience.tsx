import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import UploadModal from "./uploadModal";
import "./LaborExperience.css";
import { toast } from "react-toastify";
import axios from "axios";
import {
  validateIdType,
  validateStartDate,
  validateCertificate,
  validateResponsibilities,
  validateIdProof,
} from "../../../utils/laborRegisterValidators";
import {
  setError,
  setLoading,
  setFormData,
  setUnsavedChanges,
  setNavigateBack,
  setIsLaborAuthenticated,
} from "../../../redux/slice/laborSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { ExperiencePage } from "../../../services/LaborAuthServices";
import "../../Auth/LoadingBody.css";
import Card from "./LaborRequestModal";


interface Certificate {
  certificateDocument: string;
  certificateName: string;
}

const LaborRegisterExperience = () => {
  const [openModal, setOpenModal] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [uploadType, setUploadType] = useState(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certificateImages, setCertificateImages] = useState<File[]>([]);
  const [certificateText, setCertificateText] = useState<string[]>([]);
  const [showSecondCertificate, setShowSecondCertificate] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [responsiblity, setResponsiblity] = useState<string>("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [idType, setIdType] = useState<string>("");
  const [sucess, setSucess] = useState(false);
  const unsavedChanges = useSelector(
    (state: RootState) => state.labor.unsavedChanges
  );
  const loading = useSelector((state: RootState) => state.labor.loading);
  // const navigateBack = useSelector((state: RootState) => state.labor.navigateBack)
  const email = useSelector((state: RootState) => state.labor.formData.email);
  const formData = useSelector((state: RootState) => state.labor.formData);


  useEffect(() => {
  console.log('Success state:', sucess);
}, [sucess]);

  const error: {
    idType?: string;
    certificate?: string;
    startDate?: string;
    responsiblity?: string;
    idProof?: string;
  } = useSelector((state: RootState) => state.labor.error);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  useEffect(() => {
  //   if (formData) {  // Only set data if formData exists
  //     dispatch(setUnsavedChanges(true))
  //     setCategory(formData.category || '')
  //     setStartTime(formData.startTime || '')
  //     setEndTime(formData.endTime || '')
  //     setSkill(formData.skill || '')
  //     setImage(formData.image || '')
  //     setAvailability(Array.isArray(formData.availability) ? formData.availability : [])
  //   }
  //   }, [formData, dispatch])

  useEffect(() => {
    const handleBeforeunLoad = (event: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Do you really want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeunLoad);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeunLoad);
    };
  }, [unsavedChanges]);

  // Handle certificate text change
  const handleCertificateTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newCertificateText = [...certificateText];
    newCertificateText[index] = e.target.value;
    setCertificateText(newCertificateText);

    // Update certificate name
    const newCertificates = [...certificates];
    if (newCertificates[index]) {
      newCertificates[index] = {
        ...newCertificates[index],
        certificateName: e.target.value,
      };
      setCertificates(newCertificates);
    }
  };

  // Handle file selection
  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      if (uploadType === "id") {
        setIdImage(file); // Store the raw file
      } else if (uploadType === "certificate") {
        const newCertificate: Certificate = {
          certificateDocument: "", // This will be populated by backend
          certificateName: certificateText[certificateImages.length] || "",
        };
        setCertificates((prev) => [...prev, newCertificate]);
        setCertificateImages((prev) => [...prev, file]);
      }
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const handleShowSecondCertificate = () => {
    setShowSecondCertificate(true);
  };

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setCurrentlyWorking(checked);
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const newValue = event.target.value;
      setter(newValue);
      // console.log('Input changed:', newValue);
      dispatch(setUnsavedChanges(true));
    };

  const handleIdTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setIdType(newValue);
    // console.log('ID Type changed:', newValue);
    dispatch(setUnsavedChanges(true));
  };

  const handleOpenModal = (type) => {
    setUploadType(type);
    setOpenModal(true);
  };

  const handleDeleteImage = (type, index) => {
    if (type === "id") {
      setIdImage(null);
    } else if (type == "certificate") {
      setCertificateImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    dispatch(setLoading(true));

    // Validate all fields
    const idProofData = { idType, idImage };
    const data = { certificateText, certificateImages };

    const validationErrors = {
      idProof: validateIdProof(idProofData),
      certificate: validateCertificate(data),
      idType: validateIdType(idType),
      responsiblity: validateResponsibilities(responsiblity),
      startTime: validateStartDate(startDate),
    };

    console.log("this is error in the all errors", validationErrors);

    // Check if there are any errors
    const hasErrors = Object.values(validationErrors).some((error) => !!error);

    if (hasErrors) {
      dispatch(setError(validationErrors));
      dispatch(setLoading(false));
      toast.error("Please correct the highlighted errors.");
      return;
    } else {
      dispatch(setError({}))
    }

    try {
      const formDataForAPI = new FormData();

      if (idImage instanceof File) {
        formDataForAPI.append("idImage", idImage);
      }
      certificateImages.forEach((file) => {
        if (file instanceof File) {
          formDataForAPI.append("certificateImages", file); // Changed to use the same field name for array
        }
      });

      const certificatesData = certificateImages.map((_, index) => ({
        certificateName: certificateText[index] || "",
        certificateDocument: "",
      }));

      formDataForAPI.append("idType", idType);

      // Add certificate text
      formDataForAPI.append("certificates", JSON.stringify(certificatesData));

      // Add start time
      formDataForAPI.append("startDate", startDate);

      // Add responsibility
      formDataForAPI.append("responsibility", responsiblity);

      // Add currently working status
      formDataForAPI.append("currentlyWorking", String(currentlyWorking));

      // Add email if needed
      if (email) {
        formDataForAPI.append("email", email);
      }

      // Log formData contents for debugging
      for (let pair of formDataForAPI.entries()) {
        console.log("thsi si the fomrDatafroApit", pair[0] + ": " + pair[1]);
      }

      const response = await ExperiencePage(formDataForAPI);

      console.log("response is this :", response);

      if (response.status === 200) {
        const experienceData = {
          ...formData, // Other form data
          certificates: certificatesData,
          email,
          idImage,
          idType,
          responsiblity,
          DurationofEmployment: {
            startDate, // Assign the startDate here
            currentlyWorking, // Assign currentlyWorking here
          },
          role: "labor",
        };

        const { accessToken } = response.data.data;

        console.log("thisis seh response page data :", response);
        // Store access token in localStorage
        localStorage.setItem("LaborAccessToken", accessToken);

        console.log("thisis seh exprence page data :", experienceData);
        setSucess(true);
        
        dispatch(setLoading(false));
        toast.success("experience Page uploaded sucessfuly....!");
      } else {
        dispatch(setLoading(false));
        throw new Error(response.data.message || "An error occurred");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        console.error("Axios error:", message);
        toast.error(message);
        dispatch(setLoading(false)); 
      } else {
        dispatch(setLoading(false));
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSuccessNavigation = () => {
    const certificatesData = certificateImages.map((_, index) => ({
      certificateName: certificateText[index] || "",
      certificateDocument: "",
    }));
    const experienceData = {
      ...formData, // Other form data
      certificates: certificatesData,
      email,
      idImage,
      idType,
      responsiblity,
      DurationofEmployment: {
        startDate, // Assign the startDate here
        currentlyWorking, // Assign currentlyWorking here
      },
      role: "labor",
    };
    setTimeout(() => {   
      dispatch(setIsLaborAuthenticated(true));
      dispatch(setFormData(experienceData));
  
      toast.success("his every one ..");
      navigate('/labor/ProfilePage')
    },200)
  };

  //  console.log('this is the idType : to send ',idType)
  const handleNavigateTotheProfile = () => {
    const experienceData = {
      ...formData, // Other form data
      certificateImages,
      certificateText,
      email,
      idImage,
      idType,
      responsiblity,
      DurationofEmployment: {
        startDate, // Assign the startDate here
        currentlyWorking,
        role: "labor", // Assign currentlyWorking here
      },
    };
    dispatch(setFormData(experienceData));
    navigate("/labor/Profile");
  };

  return (
    <div className="">
      {!loading && sucess && ( 
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="max-w-xl w-full mx-auto bg-gray-900 rounded-xl overflow-hidden">
            <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full">
                <svg
                  viewBox="0 0 48 48"
                  height={100}
                  width={100}
                  y="0px"
                  x="0px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="37.081"
                    y1="10.918"
                    x2="10.918"
                    x1="37.081"
                    id="SVGID_1__8tZkVc2cOjdg_gr1"
                  >
                    <stop stopColor="#60fea4" offset={0} />
                    <stop stopColor="#6afeaa" offset=".033" />
                    <stop stopColor="#97fec4" offset=".197" />
                    <stop stopColor="#bdffd9" offset=".362" />
                    <stop stopColor="#daffea" offset=".525" />
                    <stop stopColor="#eefff5" offset=".687" />
                    <stop stopColor="#fbfffd" offset=".846" />
                    <stop stopColor="#fff" offset={1} />
                  </linearGradient>
                  <circle
                    fill="url(#SVGID_1__8tZkVc2cOjdg_gr1)"
                    r="18.5"
                    cy={24}
                    cx={24}
                  />
                  <path
                    d="M35.401,38.773C32.248,41.21,28.293,42.66,24,42.66C13.695,42.66,5.34,34.305,5.34,24c0-2.648,0.551-5.167,1.546-7.448"
                    strokeWidth={3}
                    strokeMiterlimit={10}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    stroke="#10e36c"
                    fill="none"
                  />
                  <path
                    d="M12.077,9.646C15.31,6.957,19.466,5.34,24,5.34c10.305,0,18.66,8.354,18.66,18.66c0,2.309-0.419,4.52-1.186,6.561"
                    strokeWidth={3}
                    strokeMiterlimit={10}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    stroke="#10e36c"
                    fill="none"
                  />
                  <polyline
                    points="16.5,23.5 21.5,28.5 32,18"
                    strokeWidth={3}
                    strokeMiterlimit={10}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    stroke="#10e36c"
                    fill="none"
                  />
                </svg>
              </div>
              <h4 className="text-xl text-gray-100 font-semibold mb-5">
                Registration Successful!
              </h4>
              <p className="text-gray-300 font-medium">
                Thank you for completing your registration. Your details are now
                under review by our authorized team. Once your registration is
                approved, you will receive a confirmation email and
                notification. Afterward, you will be able to create your profile
                and explore all the features available on the website. We
                appreciate your patience!
              </p>
            </div>
            <div className="pt-5 pb-6 px-6 text-center bg-gray-800 -mb-2">
              <button className="inline-block py-3 px-5 mb-2 text-center font-semibold leading-6 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-200" onClick={handleSuccessNavigation}>
                Go to Home
             </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loader"></div>}
      {openModal && (
        <UploadModal
          onClose={() => {
            setOpenModal(false);
            setUploadType(null);
          }}
          onImageSelect={handleImageSelect}
          uploadType={uploadType}
        />
      )}
      <div className="mainText text-center sm:text-center md:text-left lg:text-left p-10 sm:p-10  lg:p-16 lg:ml-[143px] md:p-11 md:ml-[100px] ">
        <h1 className="font-semibold text-[25px] lg:text-[33px] md:text-[22px] sm:text-[18px]">
          Apply as a Labor
        </h1>
      </div>

      <div className="flex justify-center">
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[#21A391] rounded-full">
          <div className="absolute flex items-center justify-center w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-4 lg:h-4 bg-[#21A391] rounded-full">
            <svg
              className="w-full h-full text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div className="w-auto flex items-center">
          <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#21A391]"></div>
        </div>
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[#21A391] rounded-full">
          <div className="absolute flex items-center justify-center w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-4 lg:h-4 bg-[#21A391] rounded-full">
            <svg
              className="w-full h-full text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div className="w-auto flex items-center">
          <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#21A391]"></div>
        </div>
        <div
          className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 
        border-[#21A391] rounded-full"
        >
          <div className="absolute flex items-center justify-center w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-4 lg:h-4 bg-[#21A391] rounded-full"></div>
        </div>
      </div>
      <form id="profileForm" onSubmit={handleFormSubmit}>
        <div className="formsForUser mt-16 sm:mt-0 items-center sm:items-center sm:p-16 lg:p-0 flex flex-col md:flex-row lg:flex-row sm:flex-col justify-evenly lg:mt-9 md:mt-12">
          <div className="leftDive space-y-4 sm:space-y-3 lg:space-y-7">
            {idImage && (
              <div className="uploaded-image-container  flex justify-center mb-4 relative">
                <img
                  src={
                    typeof idImage === "string" && idImage
                      ? idImage
                      : idImage instanceof File
                      ? URL.createObjectURL(idImage)
                      : "/default-profile-image.png"
                  }
                  alt="ID"
                  className="w-[200px] h-[150px] object-cover rounded-md"
                />
                {/* Cross icon to delete the image */}
                <button
                  onClick={() => handleDeleteImage("id")}
                  className="absolute  right-14 bg-white rounded-full p-1 text-red-500 hover:bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-sans text-[14px] my-1">
                Choose your ID type, (e.g., Driver's License, Passport, etc.)
              </span>

              {/* Dropdown for selecting ID type */}
              <select
                value={idType} // Add this to control the select value
                onChange={handleIdTypeChange} // Add this to handle changes
                className="px-3 w-[340px] p-4 text-[14px] bg-white text-black border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
              >
                <option value="">Select an ID Type</option>
                <option value="drivers-license">Driver's License</option>
                <option value="voter-id">Voter ID</option>
                <option value="others">Others</option>
              </select>
              {error?.idProof && (
                <p className="text-red-500 text-sm mt-1">{error.idProof}</p>
              )}

              {/* Submit Button */}
              <button
                type="button"
                className="mt-4 flex w-[340px] px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
                onClick={() => handleOpenModal("id")}
              >
                Submit
              </button>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col  space-y-4">
                <span className="font-sans text-[14px] my-1">
                  You can upload a maximum of 2 certificates
                </span>

                {/* First Certificate Section */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[14px] font-medium">
                    Certificate 1 Details
                  </label>
                  <textarea
                    placeholder="Enter details for Certificate 1"
                    className="px-3 h-28 text-black w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 resize-none overflow-auto"
                    value={certificateText[0] || ""}
                    onChange={(e) => handleCertificateTextChange(e, 0)}
                  />
                </div>

                {/* First Certificate Upload/Display */}
                {!certificateImages[0] ? (
                 <button
                type="button"
                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300"
                onClick={() => handleOpenModal("certificate")}
              >
                <span className="btn__text">Upload First Certificate</span>
              </button>
                ) : (
                  <div className="relative mt-4 flex space-x-4">
                    {/* Certificate 1 */}
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(certificateImages[0])}
                        alt="Certificate 1"
                        className="w-[160px] h-[160px] rounded-md"
                      />
                      <button
                        onClick={() => handleDeleteImage("certificate", 0)}
                        className="absolute top-1 right-1 z-10 rounded-full p-1 text-red-500 hover:bg-gray-400"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Certificate 2 */}
                    {certificateImages[1] && (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(certificateImages[1])}
                          alt="Certificate 2"
                          className="w-[160px] h-[160px] rounded-md"
                        />
                        <button
                          onClick={() => handleDeleteImage("certificate", 1)}
                          className="absolute top-1 right-1 z-10 rounded-full p-1 text-red-500 hover:bg-gray-400"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Add Second Certificate Button */}
                {certificateImages[0] && !showSecondCertificate && (
                  <button
                    onClick={handleShowSecondCertificate}
                    className="rounded-lg relative w-40  h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
                  >
                    <span className="text-white font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300">
                      Add 1 more
                    </span>
                    <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                      <svg
                        className="svg w-8 text-white"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="12" x2="12" y1="5" y2="19"></line>
                        <line x1="5" x2="19" y1="12" y2="12"></line>
                      </svg>
                    </span>
                  </button>
                )}

                {/* Second Certificate Section */}
                {showSecondCertificate && (
                  <div className="mt-4 ">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[14px] font-medium">
                        Certificate 2 Details
                      </label>
                      <textarea
                        placeholder="Enter details for Certificate 2"
                        className="px-3 h-28 text-black w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 resize-none overflow-auto"
                        value={certificateText[1] || ""}
                        onChange={(e) => handleCertificateTextChange(e, 1)}
                      />
                    </div>

                    {!certificateImages[1] && (
                      <button
                        type="button"
                        className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300"
                        onClick={() => handleOpenModal("certificate")}
                      >
                        <span className="btn__text">Upload Second Certificate</span>
                      </button>
                    )}
                  </div>
                )}

                {showErrors && error?.certificate && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.certificate}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rightDive space-y-7">
            <div className="flex flex-col mb-4">
              <span className="font-sans text-[14px] my-1">
                Duration of Employment
              </span>

              {/* Combined Date Inputs */}
              <div className="border rounded-md p-4">
                <div className="flex flex-col mb-4">
                  <label htmlFor="startDate" className="text-sm mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleInputChange(setStartDate)}
                    className="px-3 bg-white text-black w-full p-4 text-[14px] border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                  />
                </div>
                {showErrors && error?.startDate && (
                  <p className="text-red-500 text-sm mt-1">{error.startDate}</p>
                )}

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="currentlyWorking"
                    className="mr-2"
                    checked={currentlyWorking}
                    onChange={handleCheckBox}
                  />
                  <label htmlFor="currentlyWorking" className="text-sm">
                    Currently Working
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-sans text-[14px] my-1">
                Responsibilities and Achievements
              </span>
              <textarea
                placeholder="Describe your key responsibilities (e.g., Installed plumbing systems) and any achievements (e.g., Completed project ahead of schedule) during your work."
                className="px-3 text-black h-28 w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 resize-none overflow-auto"
                onChange={handleInputChange(setResponsiblity)}
                value={responsiblity}
              ></textarea>
              {showErrors && error?.responsiblity && (
                <p className="text-red-500 text-sm mt-1">
                  {error.responsiblity}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-center mt-9 pb-8 gap-8 ">
        {/* Previous Button */}
        <div className="relative group">
          <button
            type="button"
            className="w-[170px] sm:w-[190px] md:w-[290px] lg:w-[440px] relative inline-block p-px font-semibold leading-6 text-white bg-[#1C3D7A] cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
            onClick={handleNavigateTotheProfile}
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            <span className="relative z-10 block px-6 py-3 rounded-xl bg-[#1C3D7A]">
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <svg
                  className="w-6 h-6 transition-transform duration-500 group-hover:-translate-x-1"
                  data-slot="icon"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M11.78 14.78a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06L8.06 10l3.72 3.72a.75.75 0 0 1 0 1.06Z"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="transition-all duration-500 group-hover:-translate-x-1">
                  Previous Step
                </span>
              </div>
            </span>
          </button>
        </div>

        {/* Next/Submit Button */}
        <div className="relative group">
          <button
            type="submit"
            form="profileForm"
            className="w-[170px] sm:w-[190px] md:w-[290px] lg:w-[440px] relative inline-block p-px font-semibold leading-6 text-white bg-[#1C3D7A] cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            <span className="relative z-10 block px-6 py-3 rounded-xl bg-[#1C3D7A]">
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <span className="transition-all duration-500 group-hover:translate-x-1">
                  Next Step
                </span>
                <svg
                  className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                  data-slot="icon"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaborRegisterExperience;
