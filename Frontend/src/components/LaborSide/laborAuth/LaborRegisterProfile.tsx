import { useNavigate } from "react-router-dom"
import userIMage from '../../../assets/userImage.jpg'
const LaborRegisterProfile = () => {

const navigate = useNavigate()

  const handleNextExperiencePage = () => {
      navigate('/labor/experiencePage')
    }
  const handleBacktotheAbout = () => {
      navigate('/labor/registerPage')
    }

   return (
    <div>
      <div className="mainText text-center sm:text-center md:text-left lg:text-left p-10 sm:p-10  lg:p-16 lg:ml-[143px] md:p-11 md:ml-[100px] ">
        <h1 className="font-semibold text-[25px] lg:text-[33px] md:text-[22px] sm:text-[18px]">Apply as a Labor</h1>
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
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 
        border-[#21A391] rounded-full">
          <div className="absolute flex items-center justify-center w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-4 lg:h-4 bg-[#21A391] rounded-full"></div>
      </div>
      <div className="w-auto flex items-center">
          <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#ECECEC]"></div>
        </div>
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[##ECECEC] rounded-full">
      
      </div>
      </div>
      <div className="formsForUser mt-16 sm:mt-0  items-center sm:items-center sm:p-16 lg:p-0 flex flex-col md:flex-row lg:flex-row sm:flex-col justify-evenly lg:mt-9 md:mt-12">
        <div className="leftDive space-y-4 sm:space-y-3 lg:space-y-7">
          <div className="flex space-x-5 items-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-44  lg:h-44 rounded-full overflow-hidden border-2 border-blue-500">
              {/* Default or Uploaded User Image */}
              <img
                src="https://via.placeholder.com/150" // Replace with the default user image or uploaded image
                alt="User Profile"
                className="w-full h-full object-cover"
              />
              {/* File Input for Upload */}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("Selected file:", file);
                  }
                }}
              />
             </div>
             <span className="font-sans text-[14px] my-1">Click to Upload Your Image</span>
          </div>
           <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Days and Weeks are Available</span>
            <div className="p-4 my-3  rounded-lg shadow-md">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="monday" className="mr-2" />
                  <label htmlFor="monday" className="text-sm">Monday</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="friday" className="mr-2" />
                  <label htmlFor="friday" className="text-sm">Friday</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="tuesday" className="mr-2" />
                  <label htmlFor="tuesday" className="text-sm">Tuesday</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="saturday" className="mr-2" />
                  <label htmlFor="saturday" className="text-sm">Saturday</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="wednesday" className="mr-2" />
                  <label htmlFor="wednesday" className="text-sm">Wednesday</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="sunday" className="mr-2" />
                  <label htmlFor="sunday" className="text-sm">Sunday</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="thursday" className="mr-2" />
                  <label htmlFor="thursday" className="text-sm">Thursday</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="all" className="mr-2" />
                  <label htmlFor="all" className="text-sm">All</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightDive space-y-7">
          <div className="relative flex flex-col">
              <span className="font-sans text-[14px] my-1">Category</span>
              <input
                placeholder="Electrician, plumber, cleaner...."
                className="px-3 w-[340px] text-black p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 pr-10" // Added pr-10 for padding on the right side
              />
              <i className="absolute right-5 top-[57px] transform -translate-y-1/2 text-gray-500 fas fa-chevron-down"></i> {/* FontAwesome Dropdown Icon */}
            </div>
            <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Skill/Service</span>
            <input
              placeholder="Enter your Skill/Service....."
              className="px-3 w-[340px] text-black  p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
            />
          </div>
            <div className="flex flex-col">
        `<span className="font-sans text-[14px] my-1">Hours of Availability</span>
        
        <div className="p-4 border border-gray-300 rounded-lg shadow-md">
          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="start-time" className="text-sm">Start Time:</label>
              <input
                type="time"
                id="start-time"
                className="px-3 w-[150px] p-2 text-[14px]border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                placeholder="08:00 AM"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="end-time" className="text-sm">End Time:</label>
              <input
                type="time"
                id="end-time"
                className="px-3 w-[150px] p-2 text-[14px] border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                placeholder="05:00 PM"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div className="flex items-center justify-center mt-9 mb-8">
      <div className="relative group">
        <button
          className="w-[350px] sm:w-[400px] md:w-[600px] lg:w-[900px] relative inline-block p-px font-semibold leading-6 text-white bg-[#1C3D7A] cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <span
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          ></span>

          <span className="relative z-10 block px-6 py-3 rounded-xl bg-[#1C3D7A]">
            <div className="relative z-10 flex items-center justify-between">
              {/* Left side: Previous Step */}
              <div className="flex items-center space-x-2" onClick={handleBacktotheAbout}>
                <svg
                  className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                data-slot="icon"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M11.78 14.78a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06L8.06 10l3.72 3.72a.75.75 0 0 1 0 1.06Z"
                  fill-rule="evenodd"
                ></path>
              </svg>
              <span
                className="transition-all duration-500 group-hover:translate-x-1"
                // Assuming you have a function for the previous step
              >
                Previous Step
              </span>
            </div>

          {/* Right side: Next Step */}
          <div className="flex items-center space-x-2" onClick={handleNextExperiencePage}>
            <span
              className="transition-all duration-500 group-hover:translate-x-1"
               // Assuming you have a function for the next step
            >
              Next Step
            </span>
            <svg
              className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
              data-slot="icon"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </span>
    </button>
  </div>
</div>

    </div>
  )
}

export default LaborRegisterProfile
