// import { Link, useNavigate } from "react-router-dom"
// import AnimatedPage from "../AnimatedPage/Animated"
// import { useDispatch, useSelector } from "react-redux"
// import { RootState } from "../../redux/store/store"
// import { toast } from "react-toastify"
// import { logout } from "../../services/UserAuthServices"
// import { setisUserAthenticated, setUser, resetUser ,setFormData} from '../../redux/slice/userSlice'
// import { setIsLaborAuthenticated, setLaborer  } from '../../redux/slice/laborSlice'
import { useEffect , useState} from "react"
// import { resetLaborer }  from '../../redux/slice/laborSlice'

import HomeImage from '../../assets/Icons/Home image_enhanced.png'
import HomeNavBar from "../HomeNavBar"
import laborImage from '../../assets/char1.jpeg'
import './UserHome.css'
import aboutImage from '../../assets/abouPage.png'
import thridbg from '../../assets/image 3.png'
import Lbor1 from '../../assets/7ik7ik.jpg'
import Lbor2 from '../../assets/project_1_1-1.jpg'
import Lbor3 from '../../assets/register image.jpg'
import ServiceCard from "./serviceCards"

const UserHome = () => {
  const [displayCount, setDisplayCount] = useState(4);
  const [scrollPosition, setScrollPosition] = useState(0);

  // const { user } = useSelector((state: RootState) => state.user)
  // const { formData } = useSelector((state: RootState) => state.user.formData)
  // const { laborer } = useSelector((state: RootState) => state.labor)
  // const  firstName  = useSelector((state: RootState) => state.user.user.firstName)
  // const  lastName  = useSelector((state: RootState) => state.user.user.lastName)
  // const isUserAthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
  // const isLaborAthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)
  // // // const accessToken = localStorage.getItem('accessToken');
  // console.log('this is firstName',firstName)
  // console.log('this is lastName',lastName)
  // console.log('this is laborer',laborer)
  // console.log('this is user',user)
  // // console.log('this is role',email)
  // console.log('this is isAthenticated',isUserAthenticated)
  // console.log('this is isLaborAthenticated',isLaborAthenticated)
  // const navigate = useNavigate()
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(setisUserAthenticated(false))
  //  dispatch(resetUser())
  //       dispatch(setUser({}))
  //       dispatch(setFormData({}))
  // },[])

  //   const handleLogout = async () => {
  //     try {

  //       const response = await logout()

  //       console.log('this is response : ',response)

  //     if (response?.status === 200) {
  //         // Clear local storage
  //         localStorage.removeItem('accessToken');
  //         localStorage.removeItem('refreshToken');

  //       dispatch(resetUser())
  //       dispatch(setUser({}))
  //       dispatch(setisUserAthenticated(false))
  //       // Redirect to login page
  //       toast('logout successfully....!')
  //         navigate('/login');
  //       } else {
  //         console.error('Logout failed:', response);
  //         alert('Failed to logout. Please try again.');
  //       }
  //     } catch (error) {
  //       console.error('Error during logout:', error);
  //     }
  // };

  // console.log('this is shouldShowUserName :',isUserAthenticated)

  const labors = [
    {
      id: 1,
      name: "John Doe",
      occupation: "Electrician",
      description:
        "Hi, I'm John Doe, a seasoned Master Electrician with over 15 years of experience in the electrical industry.",
      rating: 5,
      image: { laborImage },
    },
    {
      id: 2,
      name: "Jane Smith",
      occupation: "Plumber",
      description:
        "Hi, I'm Jane Smith, a seasoned Master Plumber with over 15 years of experience in the plumbing industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Mike Johnson",
      occupation: "Carpenter",
      description:
        "Hi, I'm Mike Johnson, a seasoned Master Carpenter with over 15 years of experience in the carpentry industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      occupation: "Painter",
      description:
        "Hi, I'm Sarah Wilson, a seasoned Master Painter with over 15 years of experience in the painting industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      occupation: "Painter",
      description:
        "Hi, I'm Sarah Wilson, a seasoned Master Painter with over 15 years of experience in the painting industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      occupation: "Painter",
      description:
        "Hi, I'm Sarah Wilson, a seasoned Master Painter with over 15 years of experience in the painting industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      occupation: "Painter",
      description:
        "Hi, I'm Sarah Wilson, a seasoned Master Painter with over 15 years of experience in the painting industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      occupation: "Painter",
      description:
        "Hi, I'm Sarah Wilson, a seasoned Master Painter with over 15 years of experience in the painting industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      occupation: "Painter",
      description:
        "Hi, I'm Sarah Wilson, a seasoned Master Painter with over 15 years of experience in the painting industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      occupation: "Painter",
      description:
        "Hi, I'm Sarah Wilson, a seasoned Master Painter with over 15 years of experience in the painting industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      occupation: "Painter",
      description:
        "Hi, I'm Sarah Wilson, a seasoned Master Painter with over 15 years of experience in the painting industry.",
      rating: 5,
      image: "https://via.placeholder.com/150",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 940) {
        setDisplayCount(4); // Show 4 items for large screens
      } else if (window.innerWidth >= 581) {
        setDisplayCount(2); // Show 2 items for medium screens
      } else {
        setDisplayCount(1); // Show 1 item for small screens
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 940) {
        setDisplayCount(4); // Show 4 items for large screens
      } else if (window.innerWidth >= 581) {
        setDisplayCount(2); // Show 2 items for medium screens
      } else {
        setDisplayCount(1); // Show 1 item for small screens
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const duplicatedLabors = [...labors, ...labors];
  // Auto-scrolling animation
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      setScrollPosition((prevPosition) => {
        const maxScroll = labors.length * 480; // Approximate width of each card + gap
        const newPosition = prevPosition + 1;
        return newPosition >= maxScroll ? 0 : newPosition;
      });
    }, 30); // Adjust speed by changing interval

    return () => clearInterval(scrollInterval);
  }, [labors.length]);

  return (
    <>
      <HomeNavBar />
      <div className="homePage mb-7 w-full overflow-hidden">
        <img src={HomeImage} alt="" className="absolute" />
        <div className="imageOverContents relative p-8">
          <h1
            className="styleText text-white text-[12px] sm:text-[16px] md:text-[16px] lg:text-[26px] md:p-1 lg:p-8 mt-[20px] sm:mt-[30px] md:-mt-[40px] lg:pt-[123px]"
            style={{ fontFamily: "'Josefin Slab', serif" }}
          >
            Connect with Skilled Professionals, Get the Job Done Right.
          </h1>
          <div className="FirstTrust p-4 sm:p-6 md:p-8 lg:p-8 pt-[60px] sm:pt-[90px] md:pt-[90px] lg:pt-[63px]">
            <h1 className="h1Text text-white text-[19px] sm:text-[22px] md:text-[10px] lg:text-[60px] font-bold leading-tight">
              Find trusted local laborers
            </h1>
            <p className="pText text-[#7EDFD2] text-[16px] sm:text-[22px] md:text-[30px] lg:text-[45px] font-bold mt-2">
              for all your needs, from repairs to renovations.
            </p>
          </div>
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="SearchBoxe relative flex items-center w-full max-w-[346px] sm:max-w-[390px] md:max-w-[490px] lg:max-w-[590px] mt-4 sm:mt-6 md:mt-1">
              <input
                type="search"
                placeholder="Find the labor by the name, category..."
                className="search w-full h-8 sm:h-12 md:h-[46px] lg:h-[65px] 
                         pl-4 sm:pl-6 md:pl-9 pr-20 sm:pr-32 md:pr-[150px] 
                         rounded-full border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-[#21A391] 
                         text-xs sm:text-sm md:text-base"
              />
              <button
                className="searchbutton absolute right-1 
                               h-7 sm:h-10 md:h-[39px] lg:h-[59px]
                               w-20 sm:w-28 md:w-[140px] lg:w-[170px]
                               px-2 sm:px-4 md:px-9 
                               bg-[#21A391] text-white rounded-full 
                               text-xs sm:text-sm md:text-[8px] lg:text-[18px] font
                               transition-all duration-200"
              >
                Find Labors
              </button>
            </div>
          </div>
          <div className="hidden md:block w-full overflow-hidden px-2 py-6 mt-14">
            <div
              className="flex space-x-8 transition-transform duration-300"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
                width: `${duplicatedLabors.length * 400}px`,
              }}
            >
              {duplicatedLabors.map((labor, index) => (
                <div
                  key={`${labor.id}-${index}`}
                  className="flex-shrink-0 w-96 bg-white rounded-lg shadow-md p-6 flex items-start gap-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={laborImage}
                      alt={labor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base lg:text-xl font-semibold text-gray-800 truncate">
                        {labor.name}
                      </h3>
                      <div className="flex items-center w-[60px] lg:w-[100px]">
                        {[...Array(labor.rating)].map((_, starIndex) => (
                          <svg
                            key={starIndex}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#118577"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                          >
                            <path d="M12 2c.38 0 .74.214.93.555l2.33 4.755 5.242.763c.387.056.727.304.902.66.175.356.155.777-.053 1.11l-3.795 4.787.878 5.367c.063.384-.096.775-.409 1.007-.313.233-.732.27-1.084.096l-4.944-2.501-4.945 2.501c-.352.174-.771.137-1.084-.096-.313-.232-.472-.623-.409-1.007l.878-5.367-3.795-4.787c-.208-.333-.228-.754-.053-1.11.175-.356.515-.604.902-.66l5.242-.763L11.07 2.555c.19-.341.55-.555.93-.555z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm lg:text-lg text-gray-500 mt-2">
                      {labor.occupation}
                    </p>

                    <p className="text-xs lg:text-base text-gray-600 mt-3 line-clamp-2">
                      {labor.description}
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
        <img src={thridbg} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Services Header */}
      <div className="relative flex justify-center lg:justify-start">
        <h1 className="text-white font-bold underline underline-offset-4 decoration-red-500 p-8 md:p-16 
          text-base sm:text-lg md:text-xl lg:text-3xl">
          Our Services
        </h1>
      </div>

      {/* Services Grid */}
      <div className="relative p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
           {/* Electrician Card */}
      <ServiceCard 
        image={Lbor1}
        title="Electrician"
        description="Our residential electrical services cover everything from routine maintenance 
          to emergency repairs. We ensure that your home's electrical systems are 
          functioning perfectly to provide you with a safe environment."
      />
      
      {/* Plumbing Card */}
      <ServiceCard 
        image={Lbor2}
        title="Plumbing"
        description="Our comprehensive plumbing services ensure your systems run smoothly. 
          From repairs to installations, we provide reliable solutions for all your plumbing needs."
        className="sm:mt-[185px] md:mt-[185px]"
      />
      
      {/* Painting Card */}
      <ServiceCard 
        image={Lbor3}
        title="Painting"
        description="Transform your space with our professional painting services. From interior to exterior painting, 
          our skilled team delivers flawless results that bring your vision to life."
      />
        </div>
        </div>
        <div className="button flex justify-center sm:justify-center lg:justify-end mr-[95px]">
          <button
            className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-[#21A391] backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20 "
          >
            <span className="text-lg">more services</span>
            <div
              className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
            >
              <div className="relative h-full w-10 bg-white/20"></div>
            </div>
          </button>
        </div>
    </div>
    </>
  );
};

export default UserHome;
