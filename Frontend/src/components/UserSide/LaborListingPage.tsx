import HomeNavBar from "../HomeNavBar";
import { Star } from "lucide-react";
import char from '../../assets/elecricianSmiling.jpg'
import plumber from '../../assets/plumberSmiling.jpg'
import carpenter from '../../assets/carpentersmiling.jpg'
import painter from '../../assets/Paint.jpg'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchLaborsByLocation } from "../../services/LaborServices";
import { setLoading } from "../../redux/slice/userSlice";
const LaborListingPage = () => {
    const theme = useSelector((state: RootState) => state.theme.mode)
  const locationOfUser = useSelector((state: RootState) => state.user.locationOfUser)
  const loading = useSelector((state: RootState) => state.user.loading)
  
  // console.log("Thsi si the locationOfUser :",locationOfUser)
    const [showFilters, setShowFilters] = useState(false);
  const [laborsList, setLaborsList] = useState([])

  console.log("Thsi sis the laborsList :  ++++++ ====-- --- -- ",laborsList)
  const navigate = useNavigate()
  const dispatch = useDispatch()
    const toggleFilters = () => {
        setShowFilters((prev) => !prev);
  };
  
  const fetchLabors = useCallback(async () => {
  dispatch(setLoading(true));
  try {
    const response = await fetchLaborsByLocation(locationOfUser);
    console.log("This is the response: ", response);
    if (response.status === 200) {
      dispatch(setLoading(false));
      setLaborsList(response.data.laborers)
      toast.success('Fetched labors successfully..');
    } else {
      toast.error("Error in labor fetching");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error in labor fetching");
  } finally {
    dispatch(setLoading(false));
  }
}, [locationOfUser, dispatch]); // Now fetchLabors doesn't need to be added to the effect dependencies

useEffect(() => {
  if (locationOfUser?.latitude && locationOfUser?.longitude) {
    fetchLabors();
  }
}, [locationOfUser, fetchLabors]);


    const users = [
  {
    id: 1,
    name: 'Jacob Jorge',
    role: 'Electrician',
    rating: 5.0,
    reviews: 42,
    description:
      "Hi, I'm Jacob Jorge, a seasoned Master Electrician with over 15 years of experience in residential and commercial electrical systems.",
    image: char,
  },
  {
    id: 2,
    name: 'Emma Watson',
    role: 'Plumber',
    rating: 4.8,
    reviews: 35,
    description:
      "I specialize in plumbing services with 10 years of experience, focusing on timely and effective solutions.",
    image: plumber,
  },
  {
    id: 3,
    name: 'John Doe',
    role: 'Carpenter',
    rating: 4.9,
    reviews: 50,
    description:
      "Expert in custom furniture and repairs, with over 20 years of craftsmanship in the woodworking industry.",
    image: carpenter,
  },
  {
    id: 4,
    name: 'Sophia Brown',
    role: 'Painter',
    rating: 4.7,
    reviews: 28,
    description:
      "Dedicated painter with 12 years of experience in interior and exterior home improvement projects.",
    image: painter,
  },
  {
    id: 5,
    name: 'Michael Lee',
    role: 'Mechanic',
    rating: 5.0,
    reviews: 40,
    description:
      "Certified mechanic with expertise in automotive diagnostics and repairs for over 15 years.",
    image: '/api/placeholder/160/160',
  },
    ];
    

    const handleNavigeProfilePage = (user) => {
      navigate('/labor/ProfilePage', { state: user });
    };



  return (
    <>
      <div>
        <HomeNavBar />
        <div className="min-h-screen ">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex flex-col lg:flex-row gap-6 py-8">
              {/* Left Sidebar - Fixed width, sticky on desktop */}
              {theme == "light" ? (
                <>
                  <button
                    onClick={toggleFilters}
                    className="block md:hidden shadow-lg sm:hidden border w-full flex justify-between items-center py-2 px-4 rounded-lg"
                  >
                    <span>Filters</span>
                    {showFilters ? (
                      <FaChevronUp className="w-4 h-4" />
                    ) : (
                      <FaChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Filters List */}
                  {showFilters && (
                    <div className="w-full bg-white p-6 rounded-lg shadow-sm space-y-6 mt-4">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Location
                        </h2>
                        <div className="space-y-3">
                          <select className="w-full p-2 border rounded-md bg-white">
                            <option>Select City</option>
                          </select>
                          <select className="w-full p-2 border rounded-md bg-white">
                            <option>Select Zip Code</option>
                          </select>
                          <select className="w-full p-2 border rounded-md bg-white">
                            <option>Distance Range</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Service Category
                        </h2>
                        <select className="w-full p-2 border rounded-md bg-white">
                          <option>Select Service</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Rating
                        </h2>
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <input type="checkbox" className="w-4 h-4" />
                              <label className="text-gray-600">
                                {rating} Star and up
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Certifications
                        </h2>
                        <div className="space-y-2">
                          {[
                            "Certified Electrician",
                            "Licensed Plumber",
                            "HVAC Certification",
                            "Other relevant certifications",
                          ].map((cert) => (
                            <div key={cert} className="flex items-center gap-2">
                              <input type="checkbox" className="w-4 h-4" />
                              <label className="text-gray-600">{cert}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors">
                        More Filters
                      </button>
                    </div>
                  )}

                  {/* largeScreeen */}

                  <div className="w-full lg:w-72 lg:sticky lg:top-8 lg:self-start hidden md:block sm:block">
                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Location
                        </h2>
                        <div className="space-y-3">
                          <select className="w-full p-2 border rounded-md bg-white">
                            <option>Select City</option>
                          </select>
                          <select className="w-full p-2 border rounded-md bg-white">
                            <option>Select Zip Code</option>
                          </select>
                          <select className="w-full p-2 border rounded-md bg-white">
                            <option>Distance Range</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Service Category
                        </h2>
                        <select className="w-full p-2 border rounded-md bg-white">
                          <option>Select Service</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Rating
                        </h2>
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <input type="checkbox" className="w-4 h-4" />
                              <label className="text-gray-600">
                                {rating} Star and up
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Certifications
                        </h2>
                        <div className="space-y-2">
                          {[
                            "Certified Electrician",
                            "Licensed Plumber",
                            "HVAC Certification",
                            "Other relevant certifications",
                          ].map((cert) => (
                            <div key={cert} className="flex items-center gap-2">
                              <input type="checkbox" className="w-4 h-4" />
                              <label className="text-gray-600">{cert}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors">
                        More Filters
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleFilters}
                    className="block md:hidden bg-[#17b1a7] sm:hidden border w-full flex justify-between items-center py-2 px-4 rounded-lg"
                  >
                    <span>Filters</span>
                    {showFilters ? (
                      <FaChevronUp className="w-4 h-4" />
                    ) : (
                      <FaChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Filters List */}
                  {showFilters && (
                    <div className="w-full  p-6 rounded-lg shadow-sm border border-gray-700 space-y-6 mt-4">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">Location</h2>
                        <div className="space-y-3">
                          <select className="w-full p-2 border rounded-md bg-[#3abcba]">
                            <option>Select City</option>
                          </select>
                          <select className="w-full p-2 border rounded-md bg-[#3abcba]">
                            <option>Select Zip Code</option>
                          </select>
                          <select className="w-full p-2 border rounded-md bg-[#3abcba]">
                            <option>Distance Range</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">
                          Service Category
                        </h2>
                        <select className="w-full p-2 border rounded-md bg-[#3abcba]">
                          <option>Select Service</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">Rating</h2>
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <input type="checkbox" className="w-4 h-4" />
                              <label className="">{rating} Star and up</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">
                          Certifications
                        </h2>
                        <div className="space-y-2">
                          {[
                            "Certified Electrician",
                            "Licensed Plumber",
                            "HVAC Certification",
                            "Other relevant certifications",
                          ].map((cert) => (
                            <div key={cert} className="flex items-center gap-2">
                              <input type="checkbox" className="w-4 h-4" />
                              <label className="">{cert}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors">
                        More Filters
                      </button>
                    </div>
                  )}

                  <div className="w-full lg:w-72 lg:sticky lg:top-8 lg:self-start hidden md:block sm:block">
                    <div className=" p-6 rounded-lg border border-gray-700 shadow-sm space-y-6">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">Location</h2>
                        <div className="space-y-3">
                          <select className="w-full p-2 rounded-md bg-[#3abcba] ">
                            <option className="">Select City</option>
                          </select>
                          <select className="w-full p-2  rounded-md  bg-[#3abcba]">
                            <option>Select Zip Code</option>
                          </select>
                          <select className="w-full p-2  rounded-md  bg-[#3abcba]">
                            <option>Distance Range</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">
                          Service Category
                        </h2>
                        <select className="w-full p-2 border rounded-md bg-[#3abcba]">
                          <option>Select Service</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">Rating</h2>
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <input type="checkbox" className="w-4 h-4 " />
                              <label className="">{rating} Star and up</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">
                          Certifications
                        </h2>
                        <div className="space-y-2">
                          {[
                            "Certified Electrician",
                            "Licensed Plumber",
                            "HVAC Certification",
                            "Other relevant certifications",
                          ].map((cert) => (
                            <div key={cert} className="flex items-center gap-2">
                              <input type="checkbox" className="w-4 h-4" />
                              <label className="">{cert}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-[#3abcba] text-white py-2 px-4 rounded-full hover:bg-[#25a7a5] transition-colors">
                        More Filters
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Right Content - Grid Layout */}
              <div className="flex-1">
                {theme === "light" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {laborsList.map((user) => (
                      <div
                        key={user.id}
                        className="p-6 rounded-lg shadow-lg flex flex-col h-full"
                        >
                            
                        <div className="w-full  h-96 mb-4">
                          <img
                            src={user.profilePicture}
                            alt={`${user.firstName} profile`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                            
                        <div className="flex flex-col flex-1 space-y-2">
                          <h2 className="text-xl font-semibold">{user.firstName} {user.lastName} </h2>
                          <span className="text-lg text-gray-600">
                            {user.categories[0]}
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < user.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              {user.rating}.0 ({user.reviews} reviews)
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm flex-1">
                            {user.description}
                          </p>
                        </div>

                            
                        <div className="mt-4  self-end">
                            <button className="bg-[#3ab3bc] w-[200px] h-[34px] text-white py-1.5 px-4 rounded-md hover:bg-[#2d919a] transition-colors text-sm" onClick={() => handleNavigeProfilePage(user)}>
                              View Profile
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col h-full"
                      >
                        <div className="w-full  h-96 mb-4">
                          <img
                            src={user.image}
                            alt={`${user.name} profile`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex flex-col flex-1 space-y-2">
                          <h2 className="text-xl font-semibold">{user.name}</h2>
                          <span className="text-lg ">{user.role}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < user.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm  ml-1">
                              {user.rating}.0 ({user.reviews} reviews)
                            </span>
                          </div>
                          <p className=" text-sm flex-1">{user.description}</p>
                        </div>

                        <div className="mt-4 self-end">
                          {/* <Link to={"/labor/ProfilePage"}> */}
                            <button className="bg-[#16a4c0f6] w-[200px] h-[34px] text-white py-1.5 px-4 rounded-md hover:bg-[#397c89f6] transition-colors text-sm" onClick={() => handleNavigeProfilePage(user)}>
                              View Profile
                            </button>
                          {/* </Link> */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaborListingPage;
