import { useNavigate } from "react-router-dom"
// import userIMage from '../../../assets/userImage.jpg'
import React, { useState , useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/store/store"
import axios from "axios"
import {
  setUnsavedChanges,
  setLoading,
  setFormData,
  setError
} from '../../../redux/slice/laborSlice'
import {
  validateEndTime,
  validateAvailability,
  validateImage,
  validateCategory,
  validateStartTime,
  validateSkill
} from "../../../utils/laborRegisterValidators"
import { toast } from 'react-toastify';
import '../../Auth/LoadingBody.css'
import { profilePage } from "../../../services/LaborAuthServices"

const LaborRegisterProfile = () => {

const navigate = useNavigate()

  
  const [image, setImage] = useState<File | string>("");
  const [category, setCategory] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [showErrors, setShowErrors] = useState(false)
  const [availability, setAvailability] = useState<string[]>([]);
  const unsavedChanges = useSelector((state: RootState) => state.labor.unsavedChanges)
  const loading = useSelector((state: RootState) => state.labor.loading)
  const formData = useSelector((state: RootState) => state.labor.formData)
  const email = useSelector((state: RootState) => state.labor.formData.email)
  const dispatch = useDispatch()
  const error: {
    image?: string;
    category?: string;
    skills?: string;
    startTime?: string;
    endTime?: string;
    availability?: string;
  } = useSelector((state: RootState) => state.labor.error);

  console.log('this is profile page form data :',formData)
  useEffect(() => {
  if (formData) {  // Only set data if formData exists
    dispatch(setUnsavedChanges(true))
    setCategory(formData.category || '')
    setStartTime(formData.startTime || '')
    setEndTime(formData.endTime || '')
    setSkills(formData.skills || [])
    setImage(formData.image || '') 
    setAvailability(Array.isArray(formData.availability) ? formData.availability : [])
  }
  }, [formData, dispatch])
  
  console.log('endTime from formData:', formData.endTime);


    const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated);
  
    useEffect(() => {
      if (isLaborAuthenticated) {
        navigate('/labor/laborDashBoard')
      }
    },[isLaborAuthenticated , navigate])

    useEffect(() => {
      const handleBeforeunLoad = (event: BeforeUnloadEvent) => {
        if (unsavedChanges) {
          event.preventDefault()
          event.returnValue = 'You have unsaved changes. Do you really want to leave?';
        }
      }
  
      window.addEventListener('beforeunload', handleBeforeunLoad)
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeunLoad)
      }
  
    }, [unsavedChanges])

  const handleInputChange =
  (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    console.log('Input changing:', event.target.value);
    const newValue = event.target.value;
    setter(newValue);
    dispatch(setUnsavedChanges(true));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, checked } = e.target;
  
  // If the checkbox is a specific day
  if (daysOfWeek.map(day => day.toLowerCase()).includes(id)) {
    setAvailability((prev) =>
      checked ? [...prev, id] : prev.filter((day) => day !== id)
    );
  } 
  // If it's the "Select All" checkbox
  else if (id === 'selectAll') {
    setAvailability(checked ? daysOfWeek.map(day => day.toLowerCase()) : []);
  }
  
  dispatch(setUnsavedChanges(true));
};


 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) : void => {
  const file = e.target.files ? e.target.files[0] : null;
  if (file && file.type.startsWith('image')) {
    setImage(file); // Store the file directly
  }
  };
  
  const handleSkillChange = (skillOption: string) => {
  setSkills(prev => 
    prev.includes(skillOption)
      ? prev.filter(skill => skill !== skillOption)
      : [...prev, skillOption]
  );
};


  const handleFormsubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true)
    console.log('iam herer')
    dispatch(setLoading(true))

     
    let imageError = null;
    if (typeof image === 'string') {
      // If the image is a string (URL), validate it
      imageError = validateImage(image);
    }
    const categoryError = validateCategory(category);
    const skillError = validateSkill(skills);
    const startTimeError = validateStartTime(startTime);
    const endTimeError = validateEndTime(endTime);
    const availabilityError = validateAvailability(availability);


    console.log('this is the error from starttime:',startTimeError)
    console.log('this is the error from endTimeError:',endTimeError)

    const formDataError = {
      image: imageError,
      category: categoryError,
      skills: skillError,
      startTime: startTimeError,
      endTime: endTimeError,
      availability: availabilityError,
    };

    if (
      imageError ||
      categoryError ||
      skillError ||
      startTimeError ||
      endTimeError ||
      availabilityError
    ) {
      setTimeout(() => {
        dispatch(setLoading(false));
        dispatch(setError(formDataError));
        toast.error("Please correct the highlighted errors.");
      }, 1000);  
      return;
    } else {

      const formDataForAPI = new FormData();
      if (typeof image !== "string") {
        formDataForAPI.append('image', image);  // Append the file directly
      } // Append the file directly
      formDataForAPI.append('category', category);
      formDataForAPI.append("skill", JSON.stringify(skills));
      formDataForAPI.append('startTime', startTime);
      formDataForAPI.append('endTime', endTime);
      formDataForAPI.append('availability', JSON.stringify(availability));
      formDataForAPI.append('email',email)


       // Log formData contents for debugging
        for (let pair of formDataForAPI.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

      try {

          const response = await profilePage(formDataForAPI)

          console.log('thsi is response :',response)

          if (response.status === 200) {

            const reduxData = {
            ...formData,
            category,
            skills,
            startTime,
            endTime,
            availability,
            email,
            // Handle image URL from response if needed
            image
            };
            console.log('This it is the reduxData : ',reduxData)
      
            dispatch(setFormData(reduxData))
          dispatch(setLoading(false))
          toast.success('Profile Page uploaded sucessfuly....!')
          navigate("/labor/experiencePage");
        } else {
           dispatch(setLoading(false))
          throw new Error(response.data.message || 'An error occurred');
        }
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          console.error("Axios error:", message);
          toast.error(message);
           dispatch(setLoading(false))
        } else {
           dispatch(setLoading(false))
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred.");
        }
      } finally {
        dispatch(setLoading(false));
      }

    }
  }

  const handleBacktotheAbout = () => {
    const reduxData = {
      ...formData,
      category,
      skills,
      startTime,
      endTime,
      availability,
      email,
      // Handle image URL from response if needed
      image,
    };
    dispatch(setFormData(reduxData))
    navigate("/labor/registerPage");
  };
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const categorySkills = {
    electrician: [
      'Residential Electrical Systems',
      'Commercial Electrical Installations', 
      'Wiring and Circuit Design',
      'Lighting Installation and Repair',
      'Electrical Maintenance',
      'Panel Upgrades',
      'Generator Installation',
      'Emergency Electrical Repairs'
    ],
    plumber: [
      'Pipe Installation',
      'Leak Repair',
      'Drain Cleaning',
      'Water Heater Services',
      'Bathroom Plumbing',
      'Kitchen Plumbing',
      'Sewer Line Repair',
      'Fixture Replacement'
    ],
    cleaner: [
      'Residential Cleaning',
      'Office Cleaning',
      'Deep Cleaning',
      'Move-in/Move-out Cleaning',
      'Window Cleaning',
      'Carpet Cleaning',
      'Post-Construction Cleaning',
      'Sanitization Services'
    ],
    carpenter: [
      'Furniture Making',
      'Wooden Flooring',
      'Cabinetry',
      'Deck Construction',
      'Roof Framing',
      'Door and Window Installation',
      'Furniture Repair',
      'Custom Woodworking'
    ],
    painter: [
      'Interior Painting',
      'Exterior Painting',
      'Wallpaper Removal',
      'Deck Staining',
      'Texture Painting',
      'Commercial Painting',
      'Residential Painting',
      'Trim and Detail Work'
    ]
  };

   return (
     <div>
       {loading && <div className="loader"></div>}
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
           <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#21A391] "></div>
         </div>
         <div
           className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 
        border-[#21A391] rounded-full"
         >
           <div className="absolute flex items-center justify-center w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-4 lg:h-4 bg-[#21A391] rounded-full"></div>
         </div>
         <div className="w-auto flex items-center">
           <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#ECECEC]"></div>
         </div>
         <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[##ECECEC] rounded-full"></div>
       </div>
       <form id="profileForm" onSubmit={handleFormsubmit}>
         <div className="formsForUser mt-16 sm:mt-0  items-center sm:items-center sm:p-16 lg:p-0 flex flex-col md:flex-row lg:flex-row sm:flex-col justify-evenly lg:mt-9 md:mt-12">
           <div className="leftDive space-y-4 sm:space-y-3 lg:space-y-7">
             <div className="flex space-x-5 items-center">
               <div
                 className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-44  lg:h-44 rounded-full overflow-hidden border-2 border-blue-500"
                 //  onClick={() => document.getElementById("fileInput")?.click()}
               >
                 {/* Default or Uploaded User Image */}
                 <img
                   src={
                     typeof image === "string" && image
                       ? image
                       : image instanceof File
                       ? URL.createObjectURL(image)
                       : "/default-profile-image.png"
                   }
                   //  default user image or uploaded image
                   alt="User Profile"
                   className="w-full h-full object-cover"
                 />
                 {/* File Input for Upload */}
                 <input
                   type="file"
                   accept="image/*"
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   id="fileInput"
                   //  value={image}
                   onChange={handleFileChange}
                 />
                 {showErrors && error?.image && (
                   <p className="text-red-500 text-sm mt-1">{error.image}</p>
                 )}
               </div>
               <span className="font-sans text-[14px] my-1">
                 Click to Upload Your Image
               </span>
             </div>
             <div className="flex flex-col">
               <span className="font-sans text-[14px] my-1">
                 Days and Weeks are Available
               </span>
               <div className="p-4 my-3 rounded-lg shadow-md">
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                   {daysOfWeek.map((day) => (
                     <div className="flex items-center" key={day.toLowerCase()}>
                       <input
                         type="checkbox"
                         id={day.toLowerCase()}
                         className="mr-2"
                         checked={availability.includes(day.toLowerCase())}
                         onChange={handleCheckboxChange}
                       />
                       <label htmlFor={day.toLowerCase()} className="text-sm">
                         {day}
                       </label>
                     </div>
                   ))}
                   {/* Select All Checkbox */}
                   <div className="flex items-center mb-2">
                     <input
                       type="checkbox"
                       id="selectAll"
                       className="mr-2"
                       checked={availability.length === daysOfWeek.length}
                       onChange={handleCheckboxChange}
                     />
                     <label htmlFor="selectAll" className="text-sm">
                       Select All
                     </label>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <div className="rightDive space-y-7">
             <div className="relative flex flex-col">
               <label className="font-sans text-[14px] my-1" htmlFor="category">
                 Category
               </label>
               <select
                 id="category"
                 className="px-3 w-[340px] text-black p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 pr-10 appearance-none"
                 value={category}
                 onChange={handleInputChange(setCategory)}
               >
                 <option value="" disabled selected>
                   Select a category
                 </option>
                 <option value="electrician">Electrician</option>
                 <option value="plumber">Plumber</option>
                 <option value="cleaner">Cleaner</option>
                 <option value="carpenter">Carpenter</option>
                 <option value="painter">Painter</option>
               </select>
               <i className="absolute right-5 top-[57px] transform -translate-y-1/2 text-gray-500 fas fa-chevron-down"></i>{" "}
               {/* FontAwesome Dropdown Icon */}
               {showErrors && error?.category && (
                 <p className="text-red-500 text-sm mt-1">{error.category}</p>
               )}
             </div>
             <div className="flex flex-col">
                <span className="font-sans text-[14px] my-1">Skills/Services</span>
                {category ? (
                  <div className="w-[340px] border rounded-md p-2">
                    {categorySkills[category as keyof typeof categorySkills].map((skillOption) => (
                      <div key={skillOption} className="flex items-center">
                        <input
                          type="checkbox"
                          id={skillOption}
                          checked={skills.includes(skillOption)}
                          onChange={() => handleSkillChange(skillOption)}
                          className="mr-2"
                        />
                        <label htmlFor={skillOption} className="text-sm">{skillOption}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    placeholder="Please select a category first"
                    className="px-3 w-[340px] text-black p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                    disabled
                  />
                )}
                {showErrors && error?.skills && (
                  <p className="text-red-500 text-sm mt-1">{error.skills}</p>
                )}
              </div>
             <div className="flex flex-col">
               <span className="font-sans text-[14px] my-1">
                 Hours of Availability
               </span>

               <div className="p-4 border border-gray-300 rounded-lg shadow-md">
                 <div className="flex flex-col gap-y-2">
                   <div className="flex justify-between items-center">
                     <label htmlFor="start-time" className="text-sm">
                       Start Time:
                     </label>
                     <input
                       type="time"
                       id="start-time"
                       className="px-3 w-[150px]  bg-white text-black p-2 text-[14px] border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                       placeholder="08:00 AM"
                       value={startTime}
                       onChange={handleInputChange(setStartTime)}
                     />
                     {showErrors && error?.startTime && (
                       <p className="text-red-500 text-sm mt-1">
                         {error.startTime}
                       </p>
                     )}
                   </div>

                   <div className="flex justify-between items-center">
                     <label htmlFor="end-time" className="text-sm">
                       End Time:
                     </label>
                     <input
                       type="time"
                       id="end-time"
                       className="px-3 w-[150px]  bg-white text-black p-2 text-[14px] border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                       placeholder="05:00 PM"
                       value={endTime}
                       onChange={handleInputChange(setEndTime)}
                     />
                     {showErrors && error?.endTime && (
                       <p className="text-red-500 text-sm mt-1">
                         {error.endTime}
                       </p>
                     )}
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </form>
       <div className="flex items-center justify-center mt-9  pb-8 gap-4">
         {/* Previous Button */}
         <div className="relative group">
           <button
             type="button"
             className="w-[170px] sm:w-[190px] md:w-[290px] lg:w-[440px] relative inline-block p-px font-semibold leading-6 text-white bg-[#1C3D7A] cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
             onClick={handleBacktotheAbout}
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
}

export default LaborRegisterProfile
