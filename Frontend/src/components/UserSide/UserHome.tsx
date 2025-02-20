// import { Link, useNavigate } from "react-router-dom"
// import AnimatedPage from "../AnimatedPage/Animated"
// import { useDispatch, useSelector } from "react-redux"
// import { RootState } from "../../redux/store/store"
// import { toast } from "react-toastify"
// import { logout } from "../../services/UserAuthServices"
// import { setisUserAthenticated, setUser, resetUser ,setFormData} from '../../redux/slice/userSlice'
// import { setIsLaborAuthenticated, setLaborer  } from '../../redux/slice/laborSlice'
import React, { lazy, Suspense, useState, useEffect , useRef, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
// import { resetLaborer }  from '../../redux/slice/laborSlice'

import HomeImage from '../../assets/Home image compressed.jpg'
import HomeNavBar from "../HomeNavBar"
import laborImage from '../../assets/char1.jpeg'
import './UserHome.css'
import aboutImage from '../../assets/abouPage.png'
import thridbg from '../../assets/image 3.png'
import Lbor1 from '../../assets/7ik7ik.jpg'
import Lbor2 from '../../assets/project_1_1-1.jpg'
import Lbor3 from '../../assets/register image.jpg'
import Lbor4 from '../../assets/blog-3-848x380.jpg'
import Lbor5 from '../../assets/CarpenteIMages.jpg'
import Lbor6 from '../../assets/faq-v1-img1.jpg'
import rootMap1  from '../../assets/register-now.avif';
import Arrow1 from '../../assets/firstArrow-removebg-preview.png';
import rootMap2  from '../../assets/secondImage.png';
import Arrow2 from '../../assets/SecondArrow-removebg-preview.png'
import rootMap3  from '../../assets/flat-social-network-infography_1212-88.jpg';
import rootMap4  from '../../assets/verify accept.avif';
import Arrow3 from '../../assets/Arrow3.png'
import Arrow4 from '../../assets/3rd_Step-removebg-preview.png'
import Arrow5 from '../../assets/3rd_step2-removebg-preview.png'
import rootMap5  from '../../assets/ThirdImage.png';
import rootMap6  from '../../assets/4th image.png';
import rootMap7  from '../../assets/Payment.png';
import rootMap8 from '../../assets/Rating.png';
import smImage from '../../assets/david-cainImageCompressed.jpg'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { toast } from 'react-toastify';
import { fetchLabors } from '../../services/LaborServices';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
const ServiceCard = lazy(() => import('./serviceCards'))
import { debounce } from 'lodash';
import Chatbot from './ChatBot';
import Footer from '../Footer';

const UserHome = () => {
  // console.log('iiiiiiiiiiiiiiiiiiiiiiiii');
  
  const [displayCount, setDisplayCount] = useState(4);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allLabors, setAllLabors] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(0);
  const isDarkmode = useSelector((state: RootState) => state.theme.mode)
  const isUserAthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Kyu3333333333333333333333333llllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$$############################')
    console.log('isDarkMode is this', isDarkmode);
  }, [isDarkmode]);

 
  useEffect(() => {
    const preloadImages = [HomeImage, aboutImage, thridbg];
    Promise.all(
      preloadImages.map((image) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image;
          img.onload = resolve;
          img.onerror = reject;
        });
      })
    ).then(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    const fetchAllLabors = async () => {
      try {
        const result = await fetchLabors();
        if (result.status === 200) {
          const { fetchedLabors } = result.data;
          setAllLabors(fetchedLabors);
        } else {
          toast.error('Error in fetching labors');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch labors');
      }
    };
    fetchAllLabors();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 940) {
        setDisplayCount(4);
      } else if (window.innerWidth >= 581) {
        setDisplayCount(2);
      } else {
        setDisplayCount(1);
      }
    };

    const debouncedHandleResize = debounce(handleResize, 100);
    handleResize();
    window.addEventListener("resize", debouncedHandleResize);
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  const duplicatedLabors = useMemo(() => {
    if (!Array.isArray(allLabors) || allLabors.length === 0) {
      return [];
    }
    return [...allLabors, ...allLabors, ...allLabors];
  }, [allLabors]);

  const cardWidth = 400;

  useEffect(() => {
    if (duplicatedLabors.length === 0 || isPaused) return;

    const scrollInterval = setInterval(() => {
      setScrollPosition((prevPosition) => {
        const maxScroll = allLabors.length * cardWidth;
        const newPosition = prevPosition + 1;

        if (newPosition >= maxScroll) {
          return 0;
        }
        return newPosition;
      });
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [allLabors.length, isPaused, duplicatedLabors.length, cardWidth]);

  const handleNavigeProfilePage = (user) => {
    console.log('This is the user :::', user);
    if (isUserAthenticated) {
      navigate("/labor/ProfilePage", { state: user });
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <HomeNavBar />
      <Chatbot/>
      <div className="homePage relative w-full min-h-screen overflow-hidden">
        {/* Desktop/Tablet background image */}
        <img
          src={HomeImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover hidden sm:block"
        />

        <div className="block sm:hidden absolute inset-0">
          <img src={smImage} alt="" className="w-full h-full object-cover" />
          {/* Mobile gradient overlay */}
          {/* <div 
        className="absolute inset-0 bg-gradient-to-r from-[#2C3333]/65 to-[#2C3333]/65
          backdrop-blur-[1px] transform will-change-transform pointer-events-none
          transition-all duration-700 ease-in-out origin-left
          group-hover:scale-x-0"
      /> */}
        </div>

        {/* Content container with responsive padding */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Hero text with better responsive scaling */}
          <h1
            className="text-white font-['Josefin_Slab'] text-center sm:text-left
        text-base sm:text-lg md:text-xl lg:text-3xl
        mt-28 sm:mt-8 md:mt-12 lg:mt-24 lg:ml-5"
          >
            Connect with Skilled Professionals, Get the Job Done Right.
          </h1>

          {/* Trust section with improved spacing */}
          <div className="mt-8  ml-4 sm:mt-12 md:mt-16 lg:mt-20">
            <h1
              className="text-white font-bold
          text-4xl sm:text-3xl md:text-4xl lg:text-6xl
          leading-tight"
            >
              Find trusted local laborers
            </h1>
            <p
              className="text-[#7EDFD2] font-bold
          text-2xl sm:text-xl md:text-2xl lg:text-4xl
          mt-2 sm:mt-3 md:mt-4"
            >
              for all your needs, from repairs to renovations.
            </p>
          </div>

          {/* Search section with responsive sizing */}
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 w-full">
            <div className="relative flex items-center w-full max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
              <input
                type="search"
                placeholder="Find the labor by the name, category..."
                className="w-full rounded-xl border border-gray-300
            h-[73px] sm:h-12 md:h-14 lg:h-16
            pl-4 sm:pl-6 md:pl-8 lg:pl-10
            pr-24 sm:pr-32 md:pr-36 lg:pr-44
            text-sm sm:text-base md:text-lg
            focus:outline-none focus:ring-2 focus:ring-[#21A391]"
              />
              <button
                className="absolute right-1 rounded-xl bg-[#21A391] text-white
          h-[64px] sm:h-10 md:h-12 lg:h-14
          w-20 sm:w-28 md:w-32 lg:w-40
          text-xs sm:text-sm md:text-base lg:text-lg
          transition-all duration-200 hover:bg-[#1a8275]"
              >
                Find Labors
              </button>
            </div>
          </div>

          {/* Labor cards section with responsive grid */}
          <div className=" md:block mt-16 overflow-hidden">
             <div
                className="flex space-x-4 sm:space-x-6 md:space-x-8 transition-transform duration-300 "
                style={{
                  transform: `translateX(-${scrollPosition}px)`,
                  width: `${duplicatedLabors.length * 400}px`,
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
              {duplicatedLabors?.map((labor, index) => (
                <div
                  key={`${labor.id}-${index}`}
                  className="flex-shrink-0 bg-white rounded-lg shadow-md
              w-72 sm:w-80 md:w-96
              p-4 sm:p-5 md:p-6
              flex items-start gap-4 sm:gap-5 md:gap-6
              hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleNavigeProfilePage(labor)}
                >
                  <div
                    className="rounded-lg overflow-hidden
              w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24
              flex-shrink-0"
                  >
                    <img
                      src={labor?.profilePicture}
                      alt={labor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className="font-semibold text-gray-800 truncate
                  text-sm sm:text-base md:text-lg lg:text-xl"
                      >
                        {labor.firstName} {labor.lastName}
                      </h3>
                     <StarRating rating={labor.rating} />
                    </div>

                    <p
                      className="text-gray-500 mt-2
                text-xs sm:text-sm md:text-base lg:text-lg"
                    >
                      {labor?.categories[0]}
                    </p>

                    <p
                      className="text-gray-600 mt-2 line-clamp-2
                text-xs sm:text-sm md:text-base"
                    >
                      {`Hi, I'm ${labor.firstName} ${labor.lastName}, a seasoned ${labor.categories[0]} with experience in the ${labor.categories[0]} industry.`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>  

      {/* AboutPage */}

      <div className="About flex sm:justify-end justify-center md:justify-end lg:justify-end lg:p-14 md:p-1 mt-12 sm:p-1 md:mr-7  lg:mr-16">
        <h1 className="Abouttext text-[22px] font-bold underline underline-offset-4 decoration-red-500 sm:text-[18px] md:text-[19px] lg:text-[32px]">
          About Us
        </h1>
      </div>

      <div className="AbotPageDiscrption flex flex-col md:flex-row justify-between items-center p-6 gap-8">
        {/* Left Image */}
        <div className="leftImage  flex justify-center">
          <img
            src={aboutImage}
            alt="About Us"
            className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
          />
        </div>

        {/* Right Text Content */}
        <div className="AboutPageDescription flex flex-col gap-6 max-w-[700px]">
          {/* Headlines */}
          <div className="headLines">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold ">
              Welcome to <span className="text-blue-600">LaborLink</span> -
            </h1>
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold ">
              Your Trusted Partner for Finding Skilled Labor
            </h1>
          </div>

          {/* Paragraph Text */}
          <div className="paragraphTag text-sm md:text-base  leading-relaxed">
            <p>
              At <span className="font-bold ">LaborLink</span>, we understand
              the challenges of finding reliable and skilled labor for your home
              and business needs. Whether it's an electrical issue, plumbing
              problem, painting job, or any other task, finding the right
              professional can be time-consuming and stressful. That's where we
              come in.
            </p>
            <p>
              Our platform connects you with qualified local laborers, ensuring
              that you find the best professionals for your specific needs. We
              prioritize quality and trust, making sure that every laborer on
              our platform is verified and reviewed by previous clients.
            </p>
          </div>

          {/* Mission Section */}
          <div className="OurMission">
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold  underline underline-offset-4 decoration-blue-500">
              Our Mission
            </h1>
            <p className="text-sm md:text-base  leading-relaxed">
              Our mission is to bridge the gap between clients and skilled
              laborers, providing a seamless and efficient way to hire the right
              professionals. We aim to make the process of finding and booking
              laborers as easy and stress-free as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="thirdPage mt-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          {/* Background gradient */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: "rgba(117, 198, 179, 1)",
            }}
          ></div>
        </div>

        {/* Services Header */}
        <div className="relative flex justify-center lg:justify-start">
          <h1
            className="text-white font-bold underline underline-offset-4 decoration-red-500 p-8 md:p-16 
          text-base sm:text-lg md:text-xl lg:text-3xl"
          >
            Our Services
          </h1>
        </div>

        <div className="relative overflow-hidden">
          <div className="relative">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: showMore ? "translateX(-50%)" : "translateX(0)",
                width: "200%",
              }}
            >
              {/* First set of cards */}
              <div className="w-1/2">
                <div className="relative p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                    <ServiceCard
                      image={Lbor1}
                      title="Electrician"
                      description="Find certified electricians in your area for all electrical needs. Our verified professionals handle installations, repairs, and maintenance with 24/7 emergency service availability. Hire trusted local electricians at competitive rates."
                    />

                    <ServiceCard
                      image={Lbor2}
                      title="Plumbing"
                      description="Connect with skilled plumbers for quick solutions to all your plumbing issues. From leak repairs to installations, our verified plumbers are available on-demand. Get immediate assistance from experienced local professionals."
                      className="sm:mt-[185px] md:mt-[185px]"
                    />

                    <ServiceCard
                      image={Lbor3}
                      title="Painting"
                      description="Hire professional painters for your home or office projects. Our verified painters specialize in interior and exterior work, offering precise execution and quality finishes. Find experienced local painters at reasonable rates."
                    />
                  </div>
                </div>
              </div>

              {/* Second set of cards */}
              <div className="w-1/2">
                <div className="relative p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                    <ServiceCard
                      image={Lbor4}
                      title="Carpenter"
                      description="Book skilled carpenters for all your woodworking needs. From furniture repair to custom installations, our verified craftsmen deliver quality workmanship. Find experienced local carpenters who can start your project right away."
                    />

                    <ServiceCard
                      image={Lbor5}
                      title="Roofing"
                      description="Connect with professional roofers for repairs, maintenance, and installations. Our verified roofing experts ensure your home stays protected. Hire local roofers with proven experience and competitive pricing."
                      className="sm:mt-[185px] md:mt-[185px]"
                    />

                    <ServiceCard
                      image={Lbor6}
                      title="AC Mechanic"
                      description="Find certified AC technicians for installation, repair, and maintenance. Our verified professionals offer 24/7 emergency services to keep your cooling systems running. Book local AC experts with proven expertise and fair pricing."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" mb-14 flex justify-center sm:justify-center lg:justify-end mr-[95px]">
            <button
              onClick={() => setShowMore(!showMore)}
              className=" relative inline-flex items-center justify-center overflow-hidden rounded-md bg-[#21A391] backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20"
            >
              <span className="text-lg">
                {showMore ? "previous services" : "more services"}
              </span>
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                <div className="relative h-full w-10 bg-white/20"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* lastService */}

      <div className="About flex sm:justify-end justify-center md:justify-end lg:justify-end lg:p-14 md:p-1 mt-12 sm:p-1 md:mr-7  lg:mr-16">
        <h1 className="Abouttext text-[22px] font-bold underline underline-offset-4 decoration-red-500 sm:text-[18px] md:text-[19px] lg:text-[32px]">
          How to get your labor
        </h1>
      </div>

      {/* FirstStep */}

      <div className="rootMap px-4 md:px-8 lg:px-16 mt-8 lg:mt-0 md:mt-0 sm:mt-3">
        <div className="FirstLine flex flex-col md:flex-row items-center justify-start space-y-8 md:space-y-0 md:space-x-8 relative">
          {/* Step 1 */}
          <div className="firstStep text-center md:text-left">
            <img
              src={rootMap1}
              alt="Register"
              className="mx-auto md:mx-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[250px]"
            />
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] mt-4 w-[200px] sm:w-[220px] md:w-[250px] mx-auto md:mx-0">
              Laborers sign up and create a detailed profile showcasing their
              skills, experience, and rates.
            </h1>
          </div>

          {/* Arrow 1 */}
          <div className="fristArrow hidden md:block">
            {isDarkmode === "light" ? (
              <img
                src={Arrow1}
                alt="Arrow"
                className="w-[150px] sm:w-[200px] md:w-[400px]"
              />
            ) : (
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="537.000000pt"
                height="465.000000pt"
                viewBox="0 0 537.000000 465.000000"
                preserveAspectRatio="xMidYMid meet"
                className="w-[150px] sm:w-[200px] md:w-[400px]"
              >
                <g
                  transform="translate(0.000000,465.000000) scale(0.100000,-0.100000)"
                  fill="#ffffff"
                  stroke="none"
                >
                  <path
                    d="M2400 2951 c0 -11 30 -19 48 -14 23 8 12 23 -18 23 -16 0 -30 -4 -30
                  -9z"
                  />
                  <path
                    d="M2282 2937 c-37 -11 -38 -34 -1 -29 27 4 43 16 38 29 -2 5 -18 5 -37
                  0z"
                  />
                  <path
                    d="M2550 2935 c0 -8 6 -15 14 -15 8 0 21 -3 30 -6 27 -10 18 12 -9 24
                  -33 15 -35 15 -35 -3z"
                  />
                  <path d="M3956 2881 c-3 -5 10 -11 29 -13 24 -3 35 0 35 9 0 15 -56 18 -64 4z" />
                  <path
                    d="M2145 2860 c-18 -19 -17 -20 3 -20 12 0 26 9 32 20 8 16 8 20 -3 20
                  -8 0 -22 -9 -32 -20z"
                  />
                  <path
                    d="M2680 2870 c0 -12 49 -45 56 -37 6 6 -36 47 -48 47 -4 0 -8 -4 -8
                  -10z"
                  />
                  <path
                    d="M4100 2870 c0 -5 9 -10 19 -10 11 0 28 -3 38 -7 16 -6 16 -5 4 10
                  -14 18 -61 23 -61 7z"
                  />
                  <path
                    d="M3817 2863 c-24 -23 9 -31 39 -8 18 14 18 14 -7 15 -14 0 -29 -3 -32
                  -7z"
                  />
                  <path
                    d="M4240 2837 c0 -7 14 -18 30 -24 24 -9 30 -9 30 2 0 7 -13 18 -30 24
                  -23 7 -30 7 -30 -2z"
                  />
                  <path
                    d="M3684 2826 c-10 -8 -16 -17 -13 -21 11 -10 59 6 59 21 0 18 -21 18
                  -46 0z"
                  />
                  <path
                    d="M2047 2767 c-24 -37 -22 -56 4 -30 12 11 19 29 17 39 -3 15 -6 14
                  -21 -9z"
                  />
                  <path
                    d="M3568 2773 c-16 -4 -33 -32 -24 -40 8 -9 46 18 46 32 0 8 -1 14 -2
                  14 -2 -1 -10 -3 -20 -6z"
                  />
                  <path
                    d="M4380 2771 c0 -12 29 -41 41 -41 17 0 9 18 -16 34 -14 9 -25 12 -25
                  7z"
                  />
                  <path d="M2790 2758 c0 -24 11 -48 22 -48 5 0 6 10 3 23 -10 30 -25 46 -25 25z" />
                  <path
                    d="M3435 2676 c-27 -24 -28 -26 -9 -26 24 0 48 23 42 40 -2 7 -16 0 -33
                  -14z"
                  />
                  <path
                    d="M4490 2677 c0 -17 26 -47 41 -47 15 0 10 14 -16 39 -19 17 -25 19
                  -25 8z"
                  />
                  <path
                    d="M1977 2633 c-3 -16 -3 -30 -1 -33 7 -7 24 23 24 43 0 27 -17 20 -23
                  -10z"
                  />
                  <path
                    d="M2812 2595 c0 -34 12 -48 20 -23 6 17 -3 58 -12 58 -4 0 -8 -16 -8
                  -35z"
                  />
                  <path
                    d="M3336 2574 c-15 -15 -21 -34 -11 -34 12 0 43 40 35 45 -4 3 -16 -2
                  -24 -11z"
                  />
                  <path
                    d="M4580 2553 c1 -14 30 -47 36 -41 8 8 -14 48 -26 48 -6 0 -10 -3 -10
                  -7z"
                  />
                  <path
                    d="M1954 2513 c-7 -2 -10 -13 -7 -24 4 -15 0 -22 -16 -26 -29 -7 -27
                  -19 5 -27 33 -9 36 -5 40 38 3 36 -3 46 -22 39z"
                  />
                  <path
                    d="M2762 2478 c-13 -13 -17 -48 -6 -48 10 0 33 33 34 48 0 15 -12 16
                  -28 0z"
                  />
                  <path d="M1766 2461 c-6 -10 33 -20 52 -13 7 2 12 8 12 13 0 12 -57 12 -64 0z" />
                  <path
                    d="M3250 2451 c-12 -24 -13 -41 -2 -41 8 0 32 43 32 55 0 13 -21 3 -30
                  -14z"
                  />
                  <path
                    d="M1620 2443 c0 -14 19 -17 44 -7 27 10 18 23 -14 21 -16 -1 -30 -8
                  -30 -14z"
                  />
                  <path
                    d="M4744 2452 c-5 -4 -11 -16 -11 -27 -1 -11 -3 -44 -4 -72 -3 -65 -12
                  -67 -80 -13 -28 22 -55 38 -60 34 -18 -11 -8 -30 24 -47 18 -10 46 -29 62 -43
                  61 -52 88 -25 92 92 2 82 -1 92 -23 76z"
                  />
                  <path
                    d="M4661 2410 c6 -16 15 -30 19 -30 5 0 4 14 -1 30 -6 17 -15 30 -19 30
                  -5 0 -4 -13 1 -30z"
                  />
                  <path
                    d="M2050 2420 c0 -5 6 -10 13 -10 6 0 23 -3 37 -6 24 -5 24 -5 6 10 -22
                  18 -56 21 -56 6z"
                  />
                  <path
                    d="M1481 2411 c-7 -5 -11 -13 -7 -19 8 -13 66 4 66 19 0 11 -41 11 -59
                  0z"
                  />
                  <path
                    d="M2651 2379 c-30 -24 -22 -35 13 -17 15 8 22 18 18 25 -5 8 -14 6 -31
                  -8z"
                  />
                  <path
                    d="M2197 2369 c18 -18 56 -23 51 -7 -3 7 -18 14 -34 16 -23 3 -27 1 -17
                  -9z"
                  />
                  <path
                    d="M1363 2358 c-25 -12 -31 -28 -10 -28 14 1 47 24 47 34 0 8 -11 7 -37
                  -6z"
                  />
                  <path
                    d="M1964 2348 c3 -13 5 -26 5 -30 1 -8 31 -11 31 -4 0 3 -4 16 -10 30
                  -12 32 -31 34 -26 4z"
                  />
                  <path
                    d="M2340 2336 c0 -8 14 -16 30 -18 24 -4 30 -1 28 11 -4 19 -58 26 -58
                  7z"
                  />
                  <path
                    d="M2498 2342 c-31 -6 -19 -22 17 -22 19 0 35 4 35 9 0 11 -29 18 -52
                  13z"
                  />
                  <path
                    d="M3201 2310 c-8 -24 -7 -30 5 -30 7 0 14 6 14 14 0 8 3 21 6 30 3 9 2
                  16 -4 16 -6 0 -15 -13 -21 -30z"
                  />
                  <path
                    d="M1228 2279 c-35 -37 -13 -41 29 -4 25 22 26 24 8 24 -11 0 -28 -9
                  -37 -20z"
                  />
                  <path d="M2005 2220 c-6 -10 15 -50 27 -50 9 0 10 8 2 38 -7 23 -19 29 -29 12z" />
                  <path
                    d="M1118 2201 c-17 -17 -24 -41 -13 -41 15 0 48 41 39 49 -5 5 -16 2
                  -26 -8z"
                  />
                  <path
                    d="M3142 2181 c-9 -25 -8 -31 2 -31 16 0 29 41 17 53 -5 5 -13 -5 -19
                  -22z"
                  />
                  <path
                    d="M1006 2100 c-26 -27 -16 -42 13 -19 14 12 20 23 15 28 -5 5 -17 1
                  -28 -9z"
                  />
                  <path
                    d="M2082 2065 c6 -14 15 -25 20 -25 11 0 10 7 -2 31 -16 28 -32 23 -18
                  -6z"
                  />
                  <path
                    d="M3070 2058 c-12 -14 -16 -24 -10 -26 12 -4 50 26 50 40 0 15 -19 8
                  -40 -14z"
                  />
                  <path
                    d="M902 1990 c-16 -26 -16 -45 1 -28 33 36 40 48 26 48 -8 0 -20 -9 -27
                  -20z"
                  />
                  <path
                    d="M2160 1962 c0 -5 9 -17 20 -27 19 -18 20 -17 20 2 0 12 -7 24 -16 27
                  -21 8 -24 8 -24 -2z"
                  />
                  <path
                    d="M2975 1958 c-28 -15 -28 -15 -20 -27 4 -7 14 -4 27 9 25 23 21 33 -7
                  18z"
                  />
                  <path
                    d="M837 1910 c-9 -11 -23 -20 -31 -20 -8 0 -18 -5 -22 -11 -5 -8 1 -10
                  20 -7 14 3 26 2 26 -2 0 -9 -52 -46 -78 -54 -12 -4 -20 -12 -17 -17 4 -5 14
                  -5 25 1 26 14 51 13 49 -2 -4 -30 2 -58 11 -58 6 0 10 20 10 44 0 69 20 102
                  35 56 11 -34 20 -22 18 25 -3 68 -15 80 -46 45z"
                  />
                  <path
                    d="M2270 1865 c0 -8 4 -15 9 -15 5 0 16 -3 25 -6 26 -10 18 12 -9 24
                  -21 10 -25 9 -25 -3z"
                  />
                  <path
                    d="M2842 1869 c-13 -5 -20 -13 -17 -19 4 -6 17 -4 36 5 45 24 31 35 -19
                  14z"
                  />
                  <path
                    d="M2397 1804 c6 -17 42 -29 54 -17 6 6 -4 14 -25 20 -28 9 -33 8 -29
                  -3z"
                  />
                  <path
                    d="M2711 1809 c-13 -5 -22 -12 -19 -15 8 -8 58 7 58 17 0 11 -8 11 -39
                  -2z"
                  />
                  <path
                    d="M2547 1794 c-15 -15 -6 -24 22 -24 17 0 33 5 36 10 3 6 0 10 -9 10
                  -8 0 -21 2 -28 5 -8 3 -17 2 -21 -1z"
                  />
                </g>
              </svg>
            )}
          </div>

          {/* Step 2 */}
          <div className="secondStage text-center md:text-left  ">
            <img
              src={rootMap2}
              alt="Step 2"
              className="mx-auto md:mx-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[250px]"
            />
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] mt-4 w-[200px] sm:w-[220px] md:w-[250px] mx-auto md:mx-0">
              Our team verifies the laborer's credentials and identity for added
              trust and safety.
            </h1>
          </div>

          {/* Arrow 2 */}
          <div className="secondArrow hidden md:block absolute top-[20%] sm:top-[15%] md:top-[20%] lg:top-[25%] left-[50%] sm:left-[60%] md:left-[70%] transform sm:translate-y-[20px] md:translate-y-[50px] lg:translate-y-[80px]">
            {isDarkmode === "light" ? (
              <img
                src={Arrow2}
                alt="Arrow"
                className="w-[150px] sm:w-[180px] md:w-[300px] lg:w-[360px]"
              />
            ) : (
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="471.000000pt"
                height="529.000000pt"
                viewBox="0 0 471.000000 529.000000"
                preserveAspectRatio="xMidYMid meet"
                className="w-[150px] sm:w-[180px] md:w-[300px] lg:w-[360px]"
              >
                <g
                  transform="translate(0.000000,529.000000) scale(0.100000,-0.100000)"
                  fill="#ffffff"
                  stroke="none"
                >
                  <path
                    d="M2370 3901 c0 -5 17 -18 38 -28 20 -10 46 -32 57 -50 23 -37 30 -40
                  39 -17 9 24 -74 104 -108 104 -14 0 -26 -4 -26 -9z"
                  />
                  <path
                    d="M2250 3829 c-35 -42 -55 -89 -36 -89 15 0 88 105 79 114 -10 10 -17
                  6 -43 -25z"
                  />
                  <path
                    d="M2428 3693 c-9 -16 -26 -39 -38 -51 -15 -15 -19 -27 -13 -33 11 -11
                  93 79 93 100 0 21 -26 11 -42 -16z"
                  />
                  <path
                    d="M2160 3622 c0 -30 9 -70 23 -101 l23 -52 49 33 c50 35 67 58 43 58
                  -7 0 -24 -9 -38 -20 -14 -11 -30 -20 -36 -20 -13 0 -33 60 -36 109 -5 57 -28
                  51 -28 -7z"
                  />
                  <path
                    d="M2250 3451 c0 -12 17 -31 44 -51 50 -33 66 -37 66 -15 0 8 -6 15 -14
                  15 -7 0 -19 7 -26 15 -7 9 -26 25 -42 36 l-28 20 0 -20z"
                  />
                  <path
                    d="M2041 3434 c-40 -18 -51 -28 -43 -36 8 -8 26 -5 68 13 53 23 71 42
                  42 46 -7 1 -37 -10 -67 -23z"
                  />
                  <path
                    d="M1870 3374 c-19 -7 -45 -13 -57 -13 -14 -1 -23 -7 -23 -17 0 -13 7
                  -15 43 -9 55 10 87 22 87 34 0 17 -14 19 -50 5z"
                  />
                  <path
                    d="M2430 3329 c0 -11 55 -37 101 -46 47 -9 34 12 -22 36 -57 23 -79 26
                  -79 10z"
                  />
                  <path
                    d="M1635 3316 c-34 -8 -51 -18 -53 -30 -3 -14 0 -17 18 -11 13 4 28 8
                  34 9 52 10 76 20 73 29 -5 16 -16 16 -72 3z"
                  />
                  <path
                    d="M1421 3269 c-51 -10 -59 -15 -44 -30 9 -9 20 -8 44 0 17 6 43 11 55
                  11 15 0 24 6 24 15 0 16 -13 17 -79 4z"
                  />
                  <path
                    d="M2635 3260 c-4 -6 -5 -13 -3 -16 11 -10 120 -34 130 -28 13 9 -7 21
                  -55 35 -21 5 -44 12 -52 15 -7 3 -16 0 -20 -6z"
                  />
                  <path
                    d="M1230 3238 c-30 -5 -62 -16 -70 -24 -14 -15 -9 -16 50 -9 36 3 69 10
                  74 15 19 19 -2 25 -54 18z"
                  />
                  <path
                    d="M983 3197 c-36 -11 -44 -27 -14 -27 52 0 111 14 111 26 0 15 -47 16
                  -97 1z"
                  />
                  <path
                    d="M2840 3190 c0 -8 101 -60 116 -60 2 0 4 6 4 14 0 7 -22 23 -49 35
                  -55 23 -71 26 -71 11z"
                  />
                  <path
                    d="M3030 3098 c0 -12 108 -73 116 -66 6 7 -12 25 -51 51 -43 29 -65 34
                  -65 15z"
                  />
                  <path
                    d="M3205 2990 c-6 -9 82 -81 100 -80 20 0 9 18 -33 54 -46 38 -57 42
                  -67 26z"
                  />
                  <path
                    d="M3360 2851 c0 -15 74 -101 88 -101 20 0 14 15 -25 64 -35 42 -63 59
                  -63 37z"
                  />
                  <path
                    d="M3480 2680 c0 -28 36 -120 47 -120 17 0 16 3 -4 66 -9 29 -22 55 -30
                  58 -7 3 -13 1 -13 -4z"
                  />
                  <path
                    d="M3527 2474 c-9 -36 -8 -124 2 -124 16 0 20 14 22 69 2 53 -14 90 -24
                  55z"
                  />
                  <path
                    d="M3491 2258 c-5 -13 -16 -40 -24 -60 -14 -33 -14 -38 -1 -38 14 0 54
                  78 54 106 0 22 -20 16 -29 -8z"
                  />
                  <path
                    d="M3386 2049 c-29 -59 -49 -66 -94 -33 -20 15 -40 33 -44 38 -9 14 -14
                  -2 -28 -99 -24 -168 -23 -184 6 -156 5 5 41 20 79 34 104 37 135 51 135 59 0
                  5 -51 47 -78 64 -2 1 12 26 32 56 38 55 44 78 24 78 -7 0 -22 -18 -32 -41z"
                  />
                </g>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* secondStep */}

      <div className="rootMap px-4 md:px-8 lg:px-16 lg:mt-20">
        <div className="FirstLine flex flex-col md:flex-row items-center justify-start space-y-8 md:space-y-0 md:space-x-[25px] relative">
          {/* Step 1 */}
          <div className="firstStep text-center md:text-left mt-8 md:mt-0 lg:flex lg:flex-row lg:space-x-8">
            <img
              src={rootMap4}
              alt="Register"
              className="mx-auto md:mx-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[200px] mb-4 md:mb-0 mt-12" // Added mt-12 to move the image down
            />
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] lg:mt-28 w-[200px] sm:w-[220px] md:w-[250px] mx-auto md:mx-0">
              Users select a laborer, view their profile, and initiate contact
              by describing their problem and uploading relevant images.
            </h1>
          </div>

          {/* Step 2 */}
          <div className="secondStage text-center md:text-left">
            <div className="fristArrow hidden md:block">
              {isDarkmode == "light" ? (
                <img
                  src={Arrow3}
                  alt="Arrow"
                  className="w-[150px] sm:w-[200px] md:w-[400px]"
                />
              ) : (
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="749.000000pt"
                  height="333.000000pt"
                  viewBox="0 0 749.000000 333.000000"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-[150px] sm:w-[200px] md:w-[400px]"
                >
                  <g
                    transform="translate(0.000000,333.000000) scale(0.100000,-0.100000)"
                    fill="#ffffff"
                    stroke="none"
                  >
                    <path
                      d="M5993 2479 c-50 -12 -69 -37 -49 -64 8 -12 25 -18 47 -18 33 1 186
                10 202 12 10 1 9 43 -2 60 -11 17 -138 24 -198 10z"
                    />
                    <path
                      d="M6323 2458 c-13 -6 -23 -20 -23 -32 0 -24 31 -40 95 -50 22 -4 49 -9
                60 -12 73 -16 95 -16 101 1 4 10 3 29 -2 44 -8 21 -16 26 -41 26 -17 0 -35 3
                -39 8 -4 4 -20 7 -36 7 -15 0 -28 5 -28 10 0 13 -59 12 -87 -2z"
                    />
                    <path
                      d="M5750 2449 c-37 -10 -75 -26 -100 -40 -8 -5 -27 -14 -42 -20 -37 -14
                -38 -52 -2 -75 24 -16 26 -16 56 6 17 13 61 30 97 39 56 14 67 20 75 43 8 23
                6 31 -10 43 -22 16 -26 17 -74 4z"
                    />
                    <path
                      d="M6669 2359 c-13 -25 4 -75 21 -64 6 3 13 0 16 -8 3 -8 20 -18 37 -21
                18 -3 54 -17 81 -31 51 -26 92 -25 82 1 -3 7 -1 16 4 19 12 7 -20 45 -37 45
                -7 0 -13 5 -13 10 0 6 -9 10 -19 10 -11 0 -21 4 -23 8 -4 10 -102 52 -122 52
                -8 0 -20 -10 -27 -21z"
                    />
                    <path
                      d="M5414 2307 c-17 -7 -38 -20 -48 -29 -9 -9 -26 -20 -38 -24 -33 -10
                -78 -56 -78 -79 0 -28 49 -50 64 -30 6 8 28 21 49 30 20 8 37 19 37 24 0 5 15
                15 34 21 40 13 70 52 61 80 -7 23 -34 25 -81 7z"
                    />
                    <path
                      d="M7003 2203 c-22 -8 -14 -39 17 -72 17 -17 33 -31 37 -31 3 0 21 -11
                39 -25 18 -14 37 -25 43 -25 6 0 11 -4 11 -10 0 -22 48 -9 65 17 17 25 17 27
                -6 44 -13 10 -29 19 -35 19 -6 0 -17 11 -24 25 -7 14 -18 25 -24 25 -6 0 -22
                9 -36 20 -24 19 -61 24 -87 13z"
                    />
                    <path
                      d="M5122 2109 c-13 -5 -21 -13 -18 -18 3 -5 -8 -14 -24 -21 -17 -7 -30
                -17 -30 -22 0 -5 -15 -24 -34 -41 -38 -36 -44 -51 -32 -85 12 -37 34 -26 129
                63 27 25 51 45 55 45 4 0 13 12 20 27 11 25 10 29 -10 45 -26 20 -25 20 -56 7z"
                    />
                    <path
                      d="M4862 1848 c-7 -7 -12 -20 -12 -30 0 -10 -3 -18 -8 -18 -7 0 -25 -30
                -38 -62 -3 -10 -11 -18 -16 -18 -5 0 -6 -5 -2 -12 4 -6 0 -16 -8 -22 -8 -6
                -18 -23 -21 -38 -7 -25 -4 -28 27 -33 27 -6 39 -2 55 14 12 12 19 26 16 31 -3
                5 0 12 7 17 8 4 29 39 48 76 l34 69 -25 19 c-28 22 -41 23 -57 7z"
                    />
                    <path
                      d="M1958 1813 c-21 -5 -24 -41 -5 -67 10 -14 22 -17 50 -13 21 3 39 1
                42 -3 6 -9 123 -20 141 -13 18 7 18 44 1 67 -10 13 -29 18 -85 19 -39 1 -72 5
                -72 10 0 7 -43 8 -72 0z"
                    />
                    <path
                      d="M1705 1784 c-126 -31 -135 -34 -135 -54 0 -10 6 -25 14 -33 13 -13
                28 -11 118 10 105 25 146 48 135 77 -8 20 -50 20 -132 0z"
                    />
                    <path
                      d="M2311 1741 c-20 -13 -7 -55 21 -68 13 -6 44 -17 71 -24 26 -8 47 -17
                47 -21 0 -4 8 -8 18 -8 10 0 23 -5 29 -11 17 -17 50 -1 57 27 7 27 -12 54 -38
                54 -8 0 -17 4 -20 8 -3 4 -28 14 -55 22 -28 7 -51 17 -51 22 0 11 -61 10 -79
                -1z"
                    />
                    <path
                      d="M1404 1665 c-15 -14 -32 -25 -38 -25 -6 0 -22 -12 -35 -25 -13 -14
                -27 -25 -32 -25 -5 0 -9 -6 -9 -14 0 -8 -9 -18 -20 -21 -27 -8 -25 -35 4 -63
                l24 -22 27 22 c15 13 36 33 48 46 11 12 26 22 32 22 13 0 75 67 75 81 0 9 -36
                49 -44 49 -3 0 -17 -11 -32 -25z"
                    />
                    <path
                      d="M2650 1595 c-7 -8 -10 -21 -7 -29 9 -23 76 -68 101 -68 14 0 27 -7
                30 -14 3 -8 12 -14 21 -14 8 0 15 -4 15 -10 0 -14 43 -12 64 3 30 22 15 49
                -41 76 -29 14 -52 32 -53 39 0 6 -9 12 -20 12 -11 0 -20 5 -20 10 0 16 -76 12
                -90 -5z"
                    />
                    <path
                      d="M4662 1529 c-12 -9 -22 -22 -22 -28 0 -6 -4 -11 -10 -11 -5 0 -10 -5
                -10 -11 0 -6 -19 -29 -42 -50 -38 -35 -41 -41 -32 -66 7 -20 17 -29 37 -31 18
                -2 27 1 27 11 0 7 11 20 25 27 14 7 25 17 25 22 0 5 11 19 25 32 14 13 25 29
                25 36 0 7 7 18 15 24 21 15 8 53 -19 58 -13 3 -33 -3 -44 -13z"
                    />
                    <path
                      d="M2968 1421 c-18 -18 -14 -61 6 -61 6 0 22 -10 36 -23 14 -13 39 -30
                57 -37 18 -8 38 -25 44 -38 9 -16 20 -22 38 -20 15 2 26 9 26 16 0 7 5 16 11
                20 15 9 -1 52 -20 52 -7 0 -16 7 -20 15 -3 8 -12 15 -21 15 -8 0 -15 4 -15 8
                0 5 -16 14 -35 22 -19 8 -35 17 -35 21 0 4 -8 9 -17 13 -10 3 -22 8 -28 10 -5
                3 -18 -3 -27 -13z"
                    />
                    <path
                      d="M1133 1396 c-28 -34 -83 -59 -83 -37 0 6 -7 11 -15 11 -9 0 -18 7
                -21 15 -4 8 -12 15 -20 15 -8 0 -14 5 -14 10 0 6 -13 10 -30 10 -23 0 -30 -4
                -30 -20 0 -11 -4 -20 -8 -20 -5 0 -8 -24 -8 -52 1 -75 -11 -230 -20 -251 -3
                -10 -4 -32 0 -49 3 -17 1 -37 -5 -44 -32 -39 30 -60 69 -24 12 11 49 29 81 39
                33 10 67 26 76 35 9 8 35 21 58 28 23 6 50 20 60 29 9 10 35 23 57 29 34 9 40
                15 40 38 0 21 -7 30 -31 41 -17 7 -42 24 -56 37 -14 13 -32 24 -39 24 -24 0
                -26 39 -5 69 23 32 27 71 9 89 -19 19 -35 14 -65 -22z"
                    />
                    <path
                      d="M4408 1278 c-16 -5 -28 -15 -28 -22 0 -7 -18 -18 -40 -25 -22 -6 -40
                -18 -40 -25 0 -8 -9 -16 -20 -19 -14 -3 -20 -14 -20 -31 0 -23 4 -26 35 -26
                40 0 105 24 105 38 0 5 14 15 30 22 17 7 30 17 30 22 0 5 9 17 21 26 46 38 -5
                65 -73 40z"
                    />
                    <path
                      d="M3273 1232 c-13 -2 -23 -12 -25 -25 -5 -29 20 -67 38 -60 8 3 14 1
                14 -3 0 -5 15 -15 33 -23 17 -7 46 -20 62 -27 67 -30 105 -14 92 38 -6 22 -27
                36 -62 42 -5 0 -20 7 -33 14 -12 7 -26 10 -31 8 -5 -3 -12 1 -15 10 -3 9 -13
                14 -21 10 -8 -3 -18 0 -22 7 -5 7 -18 11 -30 9z"
                    />
                    <path
                      d="M4066 1105 c-27 -8 -67 -16 -89 -19 -23 -3 -45 -10 -50 -15 -13 -13
                1 -51 19 -51 44 0 211 44 228 60 40 39 -13 51 -108 25z"
                    />
                    <path
                      d="M3582 1089 c-7 -10 -9 -25 -6 -33 7 -18 39 -30 54 -21 5 3 10 2 10
                -3 0 -11 77 -23 135 -22 64 2 83 32 45 70 -16 16 -28 19 -55 14 -18 -3 -40 -2
                -47 2 -7 5 -38 9 -69 10 -44 1 -58 -3 -67 -17z"
                    />
                  </g>
                </svg>
              )}
            </div>
          </div>

          <div className="secondStage text-center md:text-left">
            <img
              src={rootMap3}
              alt="Step 2"
              className="mx-auto md:mx-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[200px] mb-4 md:mb-0"
            />
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] mt-4 w-[200px] sm:w-[220px] md:w-[250px] mx-auto md:mx-0">
              Users search for laborers based on their specific needs (e.g.,
              electricians, plumbers) and location.
            </h1>
          </div>
        </div>
      </div>

      {/* Third Step */}

      <div className="rootMap px-4 md:px-8 lg:px-16">
        <div className="FirstLine flex flex-col md:flex-row items-center justify-start space-y-8 md:space-y-0 md:space-x-2 relative">
          {/* Step 1 */}

          {/* Arrow 1 */}
          <div className="fristArrow hidden md:block">
            {isDarkmode === "light" ? (
              <img
                src={Arrow4}
                alt="Arrow"
                className="w-[150px] sm:w-[200px] md:w-[350px]"
              />
            ) : (
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="491.000000pt"
                height="508.000000pt"
                viewBox="0 0 491.000000 508.000000"
                preserveAspectRatio="xMidYMid meet"
                className="w-[150px] sm:w-[200px] md:w-[350px]"
              >
                <g
                  transform="translate(0.000000,508.000000) scale(0.100000,-0.100000)"
                  fill="#ffffff"
                  stroke="none"
                >
                  <path
                    d="M2586 3866 c-39 -47 -43 -56 -23 -56 13 0 77 76 77 92 0 19 -21 5
                -54 -36z"
                  />
                  <path
                    d="M2467 3710 c-25 -33 -33 -51 -25 -56 12 -8 48 31 74 79 25 47 -8 32
                -49 -23z"
                  />
                  <path
                    d="M2349 3561 c-31 -39 -37 -56 -20 -56 11 0 71 74 71 86 0 19 -21 7
                -51 -30z"
                  />
                  <path
                    d="M2217 3403 c-50 -62 -27 -73 25 -12 40 47 46 59 26 59 -7 0 -30 -21
                -51 -47z"
                  />
                  <path
                    d="M2083 3260 c-32 -37 -42 -60 -24 -60 9 0 91 85 91 95 0 18 -40 -3
                -67 -35z"
                  />
                  <path
                    d="M1947 3132 c-42 -33 -61 -62 -39 -62 12 0 102 71 102 81 0 20 -19 15
                -63 -19z"
                  />
                  <path
                    d="M1557 3139 c-54 -8 -62 -13 -53 -28 4 -6 18 -6 36 -1 36 10 34 10 65
                10 26 0 34 15 13 22 -7 2 -35 1 -61 -3z"
                  />
                  <path
                    d="M1706 3124 c-3 -8 0 -14 8 -14 7 0 31 -16 55 -36 46 -40 44 -52 -9
                -74 -17 -7 -27 -17 -24 -25 4 -11 14 -10 46 5 22 10 47 25 56 34 15 15 13 20
                -35 65 -55 52 -88 67 -97 45z"
                  />
                  <path
                    d="M1410 3030 c0 -43 23 -110 38 -110 19 0 21 15 6 38 -9 14 -16 44 -16
                69 1 31 -3 43 -13 43 -11 0 -15 -12 -15 -40z"
                  />
                  <path
                    d="M1833 2963 c3 -10 8 -40 12 -66 7 -52 32 -62 27 -11 -6 69 -13 94
                -28 94 -10 0 -14 -6 -11 -17z"
                  />
                  <path
                    d="M1619 2946 c-2 -2 -20 -6 -39 -8 -37 -5 -51 -33 -15 -32 51 1 105 17
                105 30 0 13 -40 20 -51 10z"
                  />
                  <path
                    d="M1850 2773 c-1 -4 -3 -34 -7 -65 -3 -38 -2 -58 5 -58 16 0 20 11 23
                69 2 36 -1 56 -9 59 -7 2 -12 0 -12 -5z"
                  />
                  <path
                    d="M1825 2568 c-9 -30 -25 -94 -25 -105 0 -7 6 -10 13 -7 12 4 37 84 37
                115 0 14 -20 11 -25 -3z"
                  />
                  <path
                    d="M1788 2378 c-8 -26 -3 -111 8 -115 6 -2 11 15 13 39 1 23 4 45 7 49
                6 10 -6 39 -16 39 -4 0 -10 -6 -12 -12z"
                  />
                  <path
                    d="M1782 2139 c2 -40 8 -64 16 -67 10 -3 12 11 10 59 -2 39 -8 64 -16
                67 -10 3 -12 -11 -10 -59z"
                  />
                  <path
                    d="M1797 1993 c-2 -5 -3 -17 -1 -28 10 -69 16 -85 30 -85 10 0 13 7 9
                23 -9 34 -13 60 -14 80 -1 17 -16 23 -24 10z"
                  />
                  <path
                    d="M1840 1803 c0 -18 27 -82 39 -97 26 -31 28 3 4 54 -21 43 -43 66 -43
                43z"
                  />
                  <path
                    d="M1930 1641 c0 -17 62 -91 78 -91 21 0 13 15 -33 60 -25 24 -45 38
                -45 31z"
                  />
                  <path
                    d="M2555 1517 c8 -64 8 -64 -64 -69 -27 -2 -46 -9 -49 -17 -4 -12 8 -13
                65 -8 l69 7 2 -28 c4 -49 9 -66 18 -69 11 -3 166 127 172 144 3 11 -25 28 -63
                39 -5 1 -35 12 -65 24 -99 39 -93 40 -85 -23z"
                  />
                  <path
                    d="M2072 1508 c5 -14 51 -42 86 -53 42 -12 23 19 -26 43 -54 25 -65 27
                -60 10z"
                  />
                  <path
                    d="M2252 1438 c5 -15 118 -25 118 -10 0 13 -16 18 -74 21 -36 2 -47 -1
                -44 -11z"
                  />
                </g>
              </svg>
            )}
          </div>

          {/* Step 2 */}
          <div className="secondStage text-center md:text-start  ">
            <img
              src={rootMap5}
              alt="Step 2"
              className="mx-auto md:mx-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[450px]"
            />
            <h1 className="text-[14px] lg:ml-6 sm:text-[15px] md:text-[16px] w-[200px] sm:w-[220px] md:w-[450px] mx-auto md:mx-0">
              Laborer reviews the job details and provides an initial quote
              based on the description If additional work or adjustments are
              needed upon inspection the laborer updates the quote, and the user
              can accept or decline.
            </h1>
          </div>

          {/* Arrow 2 */}
          <div className="secondArrow hidden md:block absolute top-[20%] sm:top-[15%] md:top-[20%] lg:top-[25%] left-[50%] sm:left-[60%] md:left-[70%] transform sm:translate-y-[20px] md:translate-y-[50px] lg:translate-y-[80px]">
            {isDarkmode === "light" ? (
              <img
                src={Arrow5}
                alt="Arrow"
                className="w-[150px] sm:w-[180px] md:w-[300px] lg:w-[260px]"
              />
            ) : (
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="479.000000pt"
                height="521.000000pt"
                viewBox="0 0 479.000000 521.000000"
                preserveAspectRatio="xMidYMid meet"
                className="w-[150px] sm:w-[180px] md:w-[300px] lg:w-[260px]"
              >
                <g
                  transform="translate(0.000000,521.000000) scale(0.100000,-0.100000)"
                  fill="#ffffff "
                  stroke="none"
                >
                  <path
                    d="M602 4362 c-47 -4 -64 -24 -40 -48 19 -19 140 -29 169 -14 19 10 19
                14 6 33 -16 24 -63 34 -135 29z"
                  />
                  <path
                    d="M817 4332 c-2 -4 -3 -18 -3 -32 1 -18 7 -25 21 -26 11 -1 31 -5 45
                -10 14 -4 28 -9 33 -10 4 -1 8 -2 10 -3 13 -11 60 -7 72 6 20 19 15 35 -16 50
                -21 10 -46 15 -136 28 -13 2 -24 0 -26 -3z"
                  />
                  <path
                    d="M1075 4235 c3 -31 -4 -25 78 -64 70 -34 97 -35 97 -3 0 20 -29 52
                -48 52 -6 0 -27 9 -47 20 -20 11 -46 20 -59 20 -20 0 -24 -5 -21 -25z"
                  />
                  <path
                    d="M1315 4124 c-8 -9 -15 -19 -15 -23 0 -4 27 -31 61 -59 61 -52 95 -64
                105 -38 8 21 -49 89 -96 114 -35 19 -41 19 -55 6z"
                  />
                  <path
                    d="M1507 3953 c-14 -13 -6 -42 20 -73 15 -18 34 -46 42 -63 19 -36 31
                -42 54 -24 16 11 17 15 3 47 -34 83 -94 139 -119 113z"
                  />
                  <path
                    d="M1649 3724 c-10 -13 -10 -21 0 -47 7 -18 21 -54 31 -81 18 -50 41
                -66 66 -45 11 9 8 55 -6 74 -4 6 -10 22 -13 36 -7 28 -43 79 -57 79 -4 0 -13
                -7 -21 -16z"
                  />
                  <path
                    d="M1730 3450 c0 -35 19 -129 31 -152 10 -18 45 -14 52 6 5 13 -15 124
                -28 159 -4 9 -18 17 -31 17 -20 0 -24 -5 -24 -30z"
                  />
                  <path
                    d="M1765 3207 c-2 -7 -6 -36 -10 -66 -3 -29 -8 -57 -10 -61 -3 -5 -1
                -20 5 -34 10 -28 50 -37 50 -11 0 24 1 29 9 40 7 9 11 39 15 110 1 25 -3 30
                -27 32 -15 1 -30 -3 -32 -10z"
                  />
                  <path
                    d="M1751 2951 c-10 -7 -12 -26 -7 -87 7 -83 18 -106 44 -97 25 9 31 23
                26 57 -3 17 -6 51 -8 75 -4 52 -24 71 -55 52z"
                  />
                  <path
                    d="M1787 2703 c-19 -19 19 -148 50 -171 45 -33 54 21 17 103 -29 68 -49
                87 -67 68z"
                  />
                  <path
                    d="M1897 2474 c-16 -17 -4 -43 49 -102 45 -50 59 -60 70 -51 22 18 18
                27 -43 93 -61 66 -66 70 -76 60z"
                  />
                  <path
                    d="M2069 2299 c-12 -7 -12 -12 1 -36 17 -30 134 -95 157 -86 25 10 14
                47 -20 66 -17 11 -34 19 -37 19 -3 0 -12 6 -20 13 -24 22 -65 34 -81 24z"
                  />
                  <path
                    d="M2307 2183 c-4 -3 -7 -17 -7 -29 0 -19 8 -24 58 -35 89 -19 120 -19
                125 2 6 24 -7 33 -75 53 -60 17 -91 20 -101 9z"
                  />
                  <path
                    d="M2563 2163 c-14 -5 -18 -63 -5 -63 4 0 41 -2 82 -4 43 -3 80 0 87 6
                17 14 17 48 1 49 -80 5 -135 10 -143 13 -5 2 -16 1 -22 -1z"
                  />
                  <path
                    d="M2819 2133 c-19 -23 2 -47 47 -55 21 -3 52 -9 67 -12 39 -9 67 1 67
                24 0 24 -24 37 -81 45 -24 4 -54 8 -66 10 -12 2 -28 -4 -34 -12z"
                  />
                  <path
                    d="M3067 2070 c-6 -24 8 -36 53 -45 19 -4 49 -13 65 -20 37 -15 78 -3
                73 22 -4 21 -101 62 -149 63 -28 0 -38 -5 -42 -20z"
                  />
                  <path
                    d="M3331 1986 c-19 -23 -9 -38 45 -65 27 -14 56 -31 65 -38 19 -16 45
                -9 53 14 7 16 -19 53 -37 53 -5 0 -21 9 -36 19 -40 29 -75 35 -90 17z"
                  />
                  <path
                    d="M3553 1853 c-25 -9 -12 -45 39 -108 28 -36 54 -65 58 -65 3 0 15 6
                25 14 18 13 17 16 -22 68 -53 68 -85 97 -100 91z"
                  />
                  <path
                    d="M3694 1583 c3 -21 12 -63 19 -93 11 -45 17 -55 35 -56 37 -2 42 17
                26 81 -8 33 -18 70 -21 83 -4 16 -13 22 -35 22 -28 0 -29 -1 -24 -37z"
                  />
                  <path
                    d="M3731 1339 c-5 -15 -7 -30 -4 -33 3 -3 0 -12 -7 -21 -9 -11 -27 -14
                -71 -11 -73 4 -86 -8 -63 -55 10 -19 22 -43 27 -54 38 -77 100 -191 109 -202
                15 -19 27 -16 38 10 6 12 26 42 44 67 19 25 35 50 35 56 1 6 8 17 16 24 9 7
                23 28 31 46 9 19 20 34 25 34 12 0 11 47 -1 55 -5 3 -29 7 -53 9 -57 3 -63 9
                -65 52 -2 42 -5 47 -32 49 -13 1 -22 -8 -29 -26z"
                  />
                </g>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* fourtStep */}

      <div className="rootMap px-4 md:px-8 lg:px-16 lg:mt-20">
        <div className="FirstLine flex flex-col md:flex-row items-center justify-start space-y-8 md:space-y-0 md:space-x-[25px] relative">
          {/* Step 1 */}
          <div className="firstStep text-center md:text-left mt-8 md:mt-0 lg:flex lg:flex-row lg:space-x-8">
            <img
              src={rootMap7}
              alt="Register"
              className="mx-auto md:mx-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[200px] mb-4 md:mb-0 mt-12" // Added mt-12 to move the image down
            />
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] lg:mt-[90px] w-[200px] sm:w-[220px] md:w-[250px] mx-auto md:mx-0">
              The user makes a secure payment through the website.The platform
              deducts a small commission and transfers the remaining amount to
              the laborer.
            </h1>
          </div>

          {/* Step 2 */}
          <div className="secondStage text-center md:text-left">
            <div className="fristArrow hidden md:block">
              {isDarkmode == "light" ? (
                <img
                  src={Arrow3}
                  alt="Arrow"
                  className="w-[150px] sm:w-[200px] md:w-[400px]"
                />
              ) : (
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="749.000000pt"
                  height="333.000000pt"
                  viewBox="0 0 749.000000 333.000000"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-[150px] sm:w-[200px] md:w-[400px]"
                >
                  <g
                    transform="translate(0.000000,333.000000) scale(0.100000,-0.100000)"
                    fill="#ffffff"
                    stroke="none"
                  >
                    <path
                      d="M5993 2479 c-50 -12 -69 -37 -49 -64 8 -12 25 -18 47 -18 33 1 186
                10 202 12 10 1 9 43 -2 60 -11 17 -138 24 -198 10z"
                    />
                    <path
                      d="M6323 2458 c-13 -6 -23 -20 -23 -32 0 -24 31 -40 95 -50 22 -4 49 -9
                60 -12 73 -16 95 -16 101 1 4 10 3 29 -2 44 -8 21 -16 26 -41 26 -17 0 -35 3
                -39 8 -4 4 -20 7 -36 7 -15 0 -28 5 -28 10 0 13 -59 12 -87 -2z"
                    />
                    <path
                      d="M5750 2449 c-37 -10 -75 -26 -100 -40 -8 -5 -27 -14 -42 -20 -37 -14
                -38 -52 -2 -75 24 -16 26 -16 56 6 17 13 61 30 97 39 56 14 67 20 75 43 8 23
                6 31 -10 43 -22 16 -26 17 -74 4z"
                    />
                    <path
                      d="M6669 2359 c-13 -25 4 -75 21 -64 6 3 13 0 16 -8 3 -8 20 -18 37 -21
                18 -3 54 -17 81 -31 51 -26 92 -25 82 1 -3 7 -1 16 4 19 12 7 -20 45 -37 45
                -7 0 -13 5 -13 10 0 6 -9 10 -19 10 -11 0 -21 4 -23 8 -4 10 -102 52 -122 52
                -8 0 -20 -10 -27 -21z"
                    />
                    <path
                      d="M5414 2307 c-17 -7 -38 -20 -48 -29 -9 -9 -26 -20 -38 -24 -33 -10
                -78 -56 -78 -79 0 -28 49 -50 64 -30 6 8 28 21 49 30 20 8 37 19 37 24 0 5 15
                15 34 21 40 13 70 52 61 80 -7 23 -34 25 -81 7z"
                    />
                    <path
                      d="M7003 2203 c-22 -8 -14 -39 17 -72 17 -17 33 -31 37 -31 3 0 21 -11
                39 -25 18 -14 37 -25 43 -25 6 0 11 -4 11 -10 0 -22 48 -9 65 17 17 25 17 27
                -6 44 -13 10 -29 19 -35 19 -6 0 -17 11 -24 25 -7 14 -18 25 -24 25 -6 0 -22
                9 -36 20 -24 19 -61 24 -87 13z"
                    />
                    <path
                      d="M5122 2109 c-13 -5 -21 -13 -18 -18 3 -5 -8 -14 -24 -21 -17 -7 -30
                -17 -30 -22 0 -5 -15 -24 -34 -41 -38 -36 -44 -51 -32 -85 12 -37 34 -26 129
                63 27 25 51 45 55 45 4 0 13 12 20 27 11 25 10 29 -10 45 -26 20 -25 20 -56 7z"
                    />
                    <path
                      d="M4862 1848 c-7 -7 -12 -20 -12 -30 0 -10 -3 -18 -8 -18 -7 0 -25 -30
                -38 -62 -3 -10 -11 -18 -16 -18 -5 0 -6 -5 -2 -12 4 -6 0 -16 -8 -22 -8 -6
                -18 -23 -21 -38 -7 -25 -4 -28 27 -33 27 -6 39 -2 55 14 12 12 19 26 16 31 -3
                5 0 12 7 17 8 4 29 39 48 76 l34 69 -25 19 c-28 22 -41 23 -57 7z"
                    />
                    <path
                      d="M1958 1813 c-21 -5 -24 -41 -5 -67 10 -14 22 -17 50 -13 21 3 39 1
                42 -3 6 -9 123 -20 141 -13 18 7 18 44 1 67 -10 13 -29 18 -85 19 -39 1 -72 5
                -72 10 0 7 -43 8 -72 0z"
                    />
                    <path
                      d="M1705 1784 c-126 -31 -135 -34 -135 -54 0 -10 6 -25 14 -33 13 -13
                28 -11 118 10 105 25 146 48 135 77 -8 20 -50 20 -132 0z"
                    />
                    <path
                      d="M2311 1741 c-20 -13 -7 -55 21 -68 13 -6 44 -17 71 -24 26 -8 47 -17
                47 -21 0 -4 8 -8 18 -8 10 0 23 -5 29 -11 17 -17 50 -1 57 27 7 27 -12 54 -38
                54 -8 0 -17 4 -20 8 -3 4 -28 14 -55 22 -28 7 -51 17 -51 22 0 11 -61 10 -79
                -1z"
                    />
                    <path
                      d="M1404 1665 c-15 -14 -32 -25 -38 -25 -6 0 -22 -12 -35 -25 -13 -14
                -27 -25 -32 -25 -5 0 -9 -6 -9 -14 0 -8 -9 -18 -20 -21 -27 -8 -25 -35 4 -63
                l24 -22 27 22 c15 13 36 33 48 46 11 12 26 22 32 22 13 0 75 67 75 81 0 9 -36
                49 -44 49 -3 0 -17 -11 -32 -25z"
                    />
                    <path
                      d="M2650 1595 c-7 -8 -10 -21 -7 -29 9 -23 76 -68 101 -68 14 0 27 -7
                30 -14 3 -8 12 -14 21 -14 8 0 15 -4 15 -10 0 -14 43 -12 64 3 30 22 15 49
                -41 76 -29 14 -52 32 -53 39 0 6 -9 12 -20 12 -11 0 -20 5 -20 10 0 16 -76 12
                -90 -5z"
                    />
                    <path
                      d="M4662 1529 c-12 -9 -22 -22 -22 -28 0 -6 -4 -11 -10 -11 -5 0 -10 -5
                -10 -11 0 -6 -19 -29 -42 -50 -38 -35 -41 -41 -32 -66 7 -20 17 -29 37 -31 18
                -2 27 1 27 11 0 7 11 20 25 27 14 7 25 17 25 22 0 5 11 19 25 32 14 13 25 29
                25 36 0 7 7 18 15 24 21 15 8 53 -19 58 -13 3 -33 -3 -44 -13z"
                    />
                    <path
                      d="M2968 1421 c-18 -18 -14 -61 6 -61 6 0 22 -10 36 -23 14 -13 39 -30
                57 -37 18 -8 38 -25 44 -38 9 -16 20 -22 38 -20 15 2 26 9 26 16 0 7 5 16 11
                20 15 9 -1 52 -20 52 -7 0 -16 7 -20 15 -3 8 -12 15 -21 15 -8 0 -15 4 -15 8
                0 5 -16 14 -35 22 -19 8 -35 17 -35 21 0 4 -8 9 -17 13 -10 3 -22 8 -28 10 -5
                3 -18 -3 -27 -13z"
                    />
                    <path
                      d="M1133 1396 c-28 -34 -83 -59 -83 -37 0 6 -7 11 -15 11 -9 0 -18 7
                -21 15 -4 8 -12 15 -20 15 -8 0 -14 5 -14 10 0 6 -13 10 -30 10 -23 0 -30 -4
                -30 -20 0 -11 -4 -20 -8 -20 -5 0 -8 -24 -8 -52 1 -75 -11 -230 -20 -251 -3
                -10 -4 -32 0 -49 3 -17 1 -37 -5 -44 -32 -39 30 -60 69 -24 12 11 49 29 81 39
                33 10 67 26 76 35 9 8 35 21 58 28 23 6 50 20 60 29 9 10 35 23 57 29 34 9 40
                15 40 38 0 21 -7 30 -31 41 -17 7 -42 24 -56 37 -14 13 -32 24 -39 24 -24 0
                -26 39 -5 69 23 32 27 71 9 89 -19 19 -35 14 -65 -22z"
                    />
                    <path
                      d="M4408 1278 c-16 -5 -28 -15 -28 -22 0 -7 -18 -18 -40 -25 -22 -6 -40
                -18 -40 -25 0 -8 -9 -16 -20 -19 -14 -3 -20 -14 -20 -31 0 -23 4 -26 35 -26
                40 0 105 24 105 38 0 5 14 15 30 22 17 7 30 17 30 22 0 5 9 17 21 26 46 38 -5
                65 -73 40z"
                    />
                    <path
                      d="M3273 1232 c-13 -2 -23 -12 -25 -25 -5 -29 20 -67 38 -60 8 3 14 1
                14 -3 0 -5 15 -15 33 -23 17 -7 46 -20 62 -27 67 -30 105 -14 92 38 -6 22 -27
                36 -62 42 -5 0 -20 7 -33 14 -12 7 -26 10 -31 8 -5 -3 -12 1 -15 10 -3 9 -13
                14 -21 10 -8 -3 -18 0 -22 7 -5 7 -18 11 -30 9z"
                    />
                    <path
                      d="M4066 1105 c-27 -8 -67 -16 -89 -19 -23 -3 -45 -10 -50 -15 -13 -13
                1 -51 19 -51 44 0 211 44 228 60 40 39 -13 51 -108 25z"
                    />
                    <path
                      d="M3582 1089 c-7 -10 -9 -25 -6 -33 7 -18 39 -30 54 -21 5 3 10 2 10
                -3 0 -11 77 -23 135 -22 64 2 83 32 45 70 -16 16 -28 19 -55 14 -18 -3 -40 -2
                -47 2 -7 5 -38 9 -69 10 -44 1 -58 -3 -67 -17z"
                    />
                  </g>
                </svg>
              )}
            </div>
          </div>

          <div className="secondStage text-center md:text-left">
            <img
              src={rootMap6}
              alt="Step 2"
              className="mx-auto md:mx-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[250px] mb-4 md:mb-0"
            />
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] mt-4 w-[200px] sm:w-[220px] md:w-[290px] mx-auto md:mx-0">
              Once the user accepts the quote, the job is confirmed,the laborer
              visits the user's location at the agreed-upon time. The laborer
              completes the job to the user's satisfaction.
            </h1>
          </div>
        </div>
      </div>

      {/* FifthStep */}

      <div className="rootMap px-4 md:px-8 lg:px-16">
        <div className="FirstLine flex flex-col md:flex-row items-center justify-start space-y-8 md:space-y-0 md:space-x-8 relative">
          <div className="fristArrow hidden md:block">
            {isDarkmode === "light" ? (
              <img
                src={Arrow4}
                alt="Arrow"
                className="w-[150px] sm:w-[200px] md:w-[350px]"
              />
            ) : (
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="491.000000pt"
                height="508.000000pt"
                viewBox="0 0 491.000000 508.000000"
                preserveAspectRatio="xMidYMid meet"
                className="w-[150px] sm:w-[200px] md:w-[350px]"
              >
                <g
                  transform="translate(0.000000,508.000000) scale(0.100000,-0.100000)"
                  fill="#ffffff"
                  stroke="none"
                >
                  <path
                    d="M2586 3866 c-39 -47 -43 -56 -23 -56 13 0 77 76 77 92 0 19 -21 5
                -54 -36z"
                  />
                  <path
                    d="M2467 3710 c-25 -33 -33 -51 -25 -56 12 -8 48 31 74 79 25 47 -8 32
                -49 -23z"
                  />
                  <path
                    d="M2349 3561 c-31 -39 -37 -56 -20 -56 11 0 71 74 71 86 0 19 -21 7
                -51 -30z"
                  />
                  <path
                    d="M2217 3403 c-50 -62 -27 -73 25 -12 40 47 46 59 26 59 -7 0 -30 -21
                -51 -47z"
                  />
                  <path
                    d="M2083 3260 c-32 -37 -42 -60 -24 -60 9 0 91 85 91 95 0 18 -40 -3
                -67 -35z"
                  />
                  <path
                    d="M1947 3132 c-42 -33 -61 -62 -39 -62 12 0 102 71 102 81 0 20 -19 15
                -63 -19z"
                  />
                  <path
                    d="M1557 3139 c-54 -8 -62 -13 -53 -28 4 -6 18 -6 36 -1 36 10 34 10 65
                10 26 0 34 15 13 22 -7 2 -35 1 -61 -3z"
                  />
                  <path
                    d="M1706 3124 c-3 -8 0 -14 8 -14 7 0 31 -16 55 -36 46 -40 44 -52 -9
                -74 -17 -7 -27 -17 -24 -25 4 -11 14 -10 46 5 22 10 47 25 56 34 15 15 13 20
                -35 65 -55 52 -88 67 -97 45z"
                  />
                  <path
                    d="M1410 3030 c0 -43 23 -110 38 -110 19 0 21 15 6 38 -9 14 -16 44 -16
                69 1 31 -3 43 -13 43 -11 0 -15 -12 -15 -40z"
                  />
                  <path
                    d="M1833 2963 c3 -10 8 -40 12 -66 7 -52 32 -62 27 -11 -6 69 -13 94
                -28 94 -10 0 -14 -6 -11 -17z"
                  />
                  <path
                    d="M1619 2946 c-2 -2 -20 -6 -39 -8 -37 -5 -51 -33 -15 -32 51 1 105 17
                105 30 0 13 -40 20 -51 10z"
                  />
                  <path
                    d="M1850 2773 c-1 -4 -3 -34 -7 -65 -3 -38 -2 -58 5 -58 16 0 20 11 23
                69 2 36 -1 56 -9 59 -7 2 -12 0 -12 -5z"
                  />
                  <path
                    d="M1825 2568 c-9 -30 -25 -94 -25 -105 0 -7 6 -10 13 -7 12 4 37 84 37
                115 0 14 -20 11 -25 -3z"
                  />
                  <path
                    d="M1788 2378 c-8 -26 -3 -111 8 -115 6 -2 11 15 13 39 1 23 4 45 7 49
                6 10 -6 39 -16 39 -4 0 -10 -6 -12 -12z"
                  />
                  <path
                    d="M1782 2139 c2 -40 8 -64 16 -67 10 -3 12 11 10 59 -2 39 -8 64 -16
                67 -10 3 -12 -11 -10 -59z"
                  />
                  <path
                    d="M1797 1993 c-2 -5 -3 -17 -1 -28 10 -69 16 -85 30 -85 10 0 13 7 9
                23 -9 34 -13 60 -14 80 -1 17 -16 23 -24 10z"
                  />
                  <path
                    d="M1840 1803 c0 -18 27 -82 39 -97 26 -31 28 3 4 54 -21 43 -43 66 -43
                43z"
                  />
                  <path
                    d="M1930 1641 c0 -17 62 -91 78 -91 21 0 13 15 -33 60 -25 24 -45 38
                -45 31z"
                  />
                  <path
                    d="M2555 1517 c8 -64 8 -64 -64 -69 -27 -2 -46 -9 -49 -17 -4 -12 8 -13
                65 -8 l69 7 2 -28 c4 -49 9 -66 18 -69 11 -3 166 127 172 144 3 11 -25 28 -63
                39 -5 1 -35 12 -65 24 -99 39 -93 40 -85 -23z"
                  />
                  <path
                    d="M2072 1508 c5 -14 51 -42 86 -53 42 -12 23 19 -26 43 -54 25 -65 27
                -60 10z"
                  />
                  <path
                    d="M2252 1438 c5 -15 118 -25 118 -10 0 13 -16 18 -74 21 -36 2 -47 -1
                -44 -11z"
                  />
                </g>
              </svg>
            )}
          </div>
          {/* Step 2 */}
          <div className="secondStage text-center md:text-left  lg:flex lg:flex-row lg:space-x-11">
            <img
              src={rootMap8}
              alt="Step 2"
              className="mx-auto md:mx-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[350px] lg:mt-[40px]"
            />
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] lg:mt-[74px] w-[200px] sm:w-[220px] md:w-[250px] mx-auto md:mx-0">
              The user rates and reviews the laborer’s performance,helping
              others make informed decisions.
            </h1>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};
  
export default UserHome;
