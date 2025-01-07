
const LaborRegister = () => {


  return (
    <div>
      <div className="mainText text-center sm:text-center md:text-left lg:text-left p-10 sm:p-10  lg:p-16 lg:ml-[143px] md:p-11 md:ml-[100px] ">
        <h1 className="font-semibold text-[25px] lg:text-[33px] md:text-[22px] sm:text-[18px]">Apply as a Labor</h1>
      </div>

      <div className="flex justify-center">
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[#21A391] rounded-full">
      <div className="absolute w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-4 lg:h-4 bg-[#21A391] rounded-full"></div>
      </div>
      <div className="w-auto flex items-center">
          <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#ECECEC]"></div>
        </div>
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[##ECECEC] rounded-full">
     
      </div>
      <div className="w-auto flex items-center">
          <div className="w-[150px] h-1 sm:w-[200px] sm:h-1 md:w-[200px] md:h-1 lg:w-[300px] lg:h-[3px] bg-[#ECECEC]"></div>
        </div>
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 bg-white border-4 border-[##ECECEC] rounded-full">
      
      </div>
      </div>
      <div className="formsForUser mt-16 sm:mt-0  items-center sm:items-center sm:p-16 lg:p-0 flex flex-col md:flex-row lg:flex-row sm:flex-col justify-evenly lg:mt-9 md:mt-12">
        <div className="leftDive space-y-4 sm:space-y-3 lg:space-y-7">
          <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">First Name</span>
            <input
              placeholder="Enter your First Name...."
              className="px-3 w-[340px] p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
            />
          </div>
            <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Last Name</span>
            <input
              placeholder="Enter your Last Name...."
              className="px-3 w-[340px] p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
            />
          </div>
            <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Address</span>
           <textarea
            placeholder="Enter your Address..."
            className="px-3 h-28 w-[340px] p-4 text-[14px] bg-white border rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500 resize-none overflow-auto"
          ></textarea>
          </div>
        </div>
        <div className="rightDive space-y-7">
          <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Email</span>
            <input
              placeholder="Enter your Email..."
              className="px-3 w-[340px] p-4  text-[14px] bg-white  border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
            />
          </div>
            <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Password</span>
            <input
              placeholder="Enter your password..."
              className="px-3 w-[340px] p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
            />
          </div>
            <div className="flex flex-col">
            <span className="font-sans text-[14px] my-1">Language</span>
            <input
              placeholder="Enter your Language..."
              className="px-3 w-[340px] p-4 text-[14px] bg-white border  rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
            />
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
                <div className="relative z-10 flex items-center justify-end space-x-2">
                <span className="transition-all duration-500 group-hover:translate-x-1"
                >
                  Let's get started
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
              </span>
            </button>
          </div>
        </div>
    </div>
  )
}

export default LaborRegister
