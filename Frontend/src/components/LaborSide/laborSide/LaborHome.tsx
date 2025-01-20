import { useSelector } from "react-redux";
import "./LaborHome.css";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/store/store";
import { useEffect } from "react";
import ScreenSort from "../../../assets/CommpressedLaborScreenShort.png";
import ServiceCard from "../../UserSide/serviceCards";
import Frame1 from "../../../assets/Fram1.png";
import Frame2 from "../../../assets/Frame2.png";
import Frame3 from "../../../assets/Frame3.png";
import FramedServiceCard from "./FramedSuviceCard";

const LaborHome = () => {
  const labor = useSelector((state: RootState) => state.labor.formData);
  // useEffect(() => {
  //   console.log('this is labor',labor)
  // })
  return (
    <>
      <div className="relative w-full overflow-hidden">
        {/* First gradient section */}
        <div
          className="relative pt-16 pb-32 px-4 sm:px-6 md:px-8 lg:px-12 md:min-h-[760px] min-h-[690px]"
          style={{
            background:
              "linear-gradient(45deg, #74bbcf, #9ce4e8, #7ed7db, #93d4db)",
          }}
        >
          {/* Main content */}
          <div className="flex flex-col items-center max-w-7xl mx-auto">
            {/* Main Heading */}
            <div className="mainText text-center sm:text-left w-full max-w-4xl">
              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[45px] mb-2 sm:mb-3 text-gray-700">
                Build Your Reputation
              </h1>
              <h1
                className="font-bold text-[#00409A] text-2xl sm:text-3xl md:text-4xl lg:text-[45px] 
                         sm:pl-16 md:pl-28 lg:pl-44"
              >
                Grow Professionally
              </h1>
            </div>

            {/* Subtext */}
            <div className="smallText text-gray-800 text-center mt-4 sm:mt-6 md:mt-9 max-w-2xl lg:max-w-3xl">
              <h4 className="text-sm sm:text-base md:text-lg lg:text-[19px] font-light mb-2">
                Earn ratings and reviews from satisfied clients, A higher rating
                boosts your
              </h4>
              <h4 className="text-sm sm:text-base md:text-lg lg:text-[19px] font-light">
                visibility on the platform, helping you attract more clients and
                grow your business.
              </h4>
            </div>

            {/* Buttons */}
            <div
              className="buttons flex flex-col sm:flex-row justify-center items-center 
                        gap-4 sm:gap-8 md:gap-16 lg:gap-28 mt-6 sm:mt-8 md:mt-10"
            >
              <Link
                to="/labor/registerPage"
                className="bg-[#1C3D7A] text-white px-6 py-3 rounded-xl hover:bg-[#15305f] 
                       transition-colors duration-300 text-sm sm:text-base"
              >
                Become a Labor
              </Link>

              <button
                className="bg-[#D5FBF4] dark:bg-[#D5FBF4] text-black px-6 py-3 rounded-xl
                       hover:bg-[#b8f0e6] transition-colors duration-300 text-sm sm:text-base"
              >
                Frequently asked questions
              </button>
            </div>
          </div>
        </div>
        {/* Overlapping image container */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[70%] max-w-[930px] md:mt-[45px] -mt-40">
          <div className="relative w-full">
            <img
              src={ScreenSort}
              alt="Overlapping section"
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
        <div className="relative bg-[rgba(117,198,179,1)] px-4 sm:px-6 -mt-40 md:mt-0 md:px-8 lg:px-12">
          {/* Spacer for overlapping image */}
          <div className="h-[200px] sm:h-[350px] md:h-[400px] lg:h-[450px]"></div>

          {/* Service Cards Container */}
          <div className="max-w-6xl mx-auto md:mt-24 relative">
            {/* Top Row - Two Cards */}
            <div className="flex flex-col md:flex-row justify-between md:space-x-8 lg:space-x-12">
              <FramedServiceCard
                image={Frame1}
                title="Electician"
                className="w-full md:w-[350px] lg:w-[400px]"
              />
              <FramedServiceCard
                image={Frame3}
                title="Cleaning"
                className="w-full md:w-[350px] lg:w-[400px] mt-8 md:mt-0"
              />
            </div>

            {/* Center Card - Positioned Absolutely */}
            <div
              className="flex justify-center mt-8 md:mt-0 md:absolute md:left-1/2 md:top-1/3 
                        md:-translate-x-1/2 md:translate-y-24"
            >
              <FramedServiceCard
                image={Frame2}
                title="Roofing"
                className="w-full md:w-[350px] lg:w-[400px]"
              />
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="h-32 md:h-96"></div>
        </div>

        <div className="viewBaner bg-[#1C3D7A] text-white py-16">
          {/* Centered Header */}
          <div className="text-center px-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Trusted by labors all around the world
            </h1>
            <div className="w-[100px] sm:w-[200px] md:w-[400px] lg:w-[800px] mt-4 h-[4px] bg-white mx-auto"></div>
          </div>

          {/* Statistics Section */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-8 sm:gap-x-16 md:gap-x-24 lg:space-x-[220px] mt-12 px-4">
            {/* Statistic Box */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold">97%</h2>
              <p className="text-sm sm:text-base text-gray-200 mt-2">
                Satisfaction
              </p>
            </div>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold">~$1M</h2>
              <p className="text-sm sm:text-base text-gray-200 mt-2">
                Paid to Laborer
              </p>
            </div>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold">12,000+</h2>
              <p className="text-sm sm:text-base text-gray-200 mt-2 ">
                Labors Hired
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="frequentilyAskedQuestions bg-gray-100 py-10">
        <div className="container mx-auto flex  flex-wrap md:flex-nowrap  gap-8 md:space-x-[330px] px-4">
          {/* Left Side */}
          <div className="md:w-1/3 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Frequently asked: -
            </h1>
            <h4 className="text-gray-600 mt-4 text-base sm:text-lg">
              Can’t find the answer you’re looking for? Reach out to our{" "}
              <span className="text-blue-600 font-semibold">
                customer support
              </span>{" "}
              team.
            </h4>
          </div>

          {/* Right Side */}
          <div className="md:w-2/3 w-full">
            {/* Question and Answer Block */}
            <div className="space-y-6 font-[inter]">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) What is the return policy?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * You can return items within 30 days of purchase with the
                  original receipt.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) How do I track my order?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Use the tracking number sent to your email to track your
                  package on our website.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Q) Do you offer international shipping?
                </h2>
                <p className="text-gray-600 mt-2 pl-4">
                  * Yes, we ship to most countries worldwide. Additional
                  shipping charges may apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="viewBaner bg-[#1C3D7A] text-white py-16">
        {/* Centered Header */}
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            Become part of the leading <br /> labor community
          </h1>
          {/* Button */}
          <button
            className="mt-6 px-6 py-3 bg-[#FFCD38] text-[#1C3D7A] font-semibold 
                 rounded-md shadow-md hover:bg-[#FFC107] transition-all duration-300"
          >
            Become a labor
          </button>
        </div>
      </div>
    </>
  );
};

export default LaborHome;
