import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";

const LaborRegisterExperience = () => {


  const navigate = useNavigate()


  const handleNextExpreriencePage = () => {
    navigate('/labor/ProfilePage')
  }
  const handleNavigateTotheProfile = () => {
    navigate('/labor/Profile')
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
       <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 
        border-[#21A391] rounded-full">
          <div className="absolute flex items-center justify-center w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-4 lg:h-4 bg-[#21A391] rounded-full"></div>
      </div>
      </div>
      <div className="formsForUser mt-16 sm:mt-0  items-center sm:items-center sm:p-16 lg:p-0 flex flex-col md:flex-row lg:flex-row sm:flex-col justify-evenly lg:mt-9 md:mt-12">
        <div className="leftDive space-y-4 sm:space-y-3 lg:space-y-7">
          <div className="flex flex-col">
              <span className="font-sans text-[14px] my-1">
                Choose your ID type, (e.g., Driver's License, Passport, etc.)
              </span>
              
              {/* Dropdown for selecting ID type */}
              <select
                className="px-3 w-[340px] p-4 text-[14px] bg-white text-black border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
              >
                <option value="" disabled selected>Select an ID Type</option>
                <option value="drivers-license">Driver's License</option>
                <option value="passport">Passport</option>
                <option value="national-id">National ID</option>
                <option value="voter-id">Voter ID</option>
                <option value="others">Others</option>
              </select>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 w-[340px] px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
              >
                Submit
              </button>
            </div>

            <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Certifications and Training</span>
            <textarea
            placeholder="e.g., Installed and maintained electrical systems in residential buildings."
            className="px-3 h-28 w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 resize-none overflow-auto"
          ></textarea>
              
              {/* Certificate Upload Section */}
              <div className="mt-4">
                <span className="font-sans text-[14px] mb-2">Upload Certificate</span>
                <input
                  type="file"
                  className="block  w-[340px] h-[90px] text-sm text-gray-500 bg-white border rounded-md p-2 cursor-pointer"
                />
              </div>
            </div>
        </div>
        <div className="rightDive space-y-7">
          <div className="flex flex-col mb-4">
            <span className="font-sans text-[14px] my-1">Duration of Employment</span>

            {/* Combined Date Inputs */}
            <div className="border rounded-md p-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="startDate" className="text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  className="px-3 bg-white text-black w-full p-4 text-[14px] border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="endDate" className="text-sm mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  className="px-3  bg-white text-black w-full p-4 text-[14px] border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

            <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Responsibilities and Achievements</span>
            <textarea
            placeholder="Describe your key responsibilities (e.g., Installed plumbing systems) and any achievements (e.g., Completed project ahead of schedule) during your work."
            className="px-3 h-28 w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 resize-none overflow-auto"
          ></textarea>
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
              <div className="flex items-center space-x-2" onClick={handleNavigateTotheProfile}>
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
                
              >
                Previous Step
                    </span>
            </div>

          {/* Right side: Next Step */}
          <div className="flex items-center space-x-2" onClick={handleNextExpreriencePage}>
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

export default LaborRegisterExperience
