import HomeNavBar from "../HomeNavBar";
import { Star } from "lucide-react";
import char from '../../assets/elecricianSmiling.jpg'
import plumber from '../../assets/plumberSmiling.jpg'
import carpenter from '../../assets/carpentersmiling.jpg'
import painter from '../../assets/Paint.jpg'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchLaborsByLocation } from "../../services/LaborServices";
import { setLoading } from "../../redux/slice/userSlice";
import notFound from '../../assets/not Found labor.webp'
const LaborListingPage = () => {
    const theme = useSelector((state: RootState) => state.theme.mode)
  const locationOfUser = useSelector((state: RootState) => state.user.locationOfUser)



  //  const locationOfUse = useMemo(() => ({
  //   latitude: 11.151827,
  //   longitude:  75.894107
  //  }), []);
  
  const loading = useSelector((state: RootState) => state.user.loading)
  
  // console.log("Thsi si the locationOfUser :",locationOfUser)


  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZipCode, setSelectedZipCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const [filteredLabors, setFilteredLabors] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [laborsList, setLaborsList] = useState([])
  const [country, SetCountry] = useState([])
  const [state, setState] = useState([])
  const [cities, setCities] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);
  const navigate = useNavigate()
  const dispatch = useDispatch()

   
useEffect(() => {
  const uniqueCountry = Array.from(
    new Set(laborsList.map((labor) => labor.address.country.trim()))
  );


  const uniqueState = Array.from(
    new Set(laborsList.map((labor) => labor.address.state.trim()))
  );


  const uniqueCities = Array.from(
    new Set(laborsList.map((labor) => labor.address.city.trim()))
  );

  const uniqueZipCodes = Array.from(
    new Set(laborsList.map((labor) => labor.address.postalCode.trim()))
  );

  console.log("This is the cities..... ++++ ---- .", uniqueCities);

  SetCountry(uniqueCountry);
  setState(uniqueState);
  setCities(uniqueCities);
  setZipCodes(uniqueZipCodes);
}, [laborsList]);


  console.log("Thsi sis the laborsList :  ++++++ ====-- --- -- ",laborsList)
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
      // toast.success('Fetched labors successfully..');
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


    const handleNavigeProfilePage = (user) => {
      navigate('/labor/ProfilePage', { state: user });
  };
  

  const handleResetFilters = () => {
      // Reset all filter states to their initial values
      setSelectedCountry('');
      setSelectedState('');
      setSelectedCity('');
      setSelectedZipCode('');
      setSelectedCategory('');
      setSelectedRating(0);

      // Clear filtered labors to show all labors
      setFilteredLabors([]);
    };
  
  // laborsList.map((labor) => {
  //   labor.firstName
  // })


  const handleFiltersUpdate = () => {
  const filteredResults = laborsList.filter(labor => {
    const matchCountry = !selectedCountry || labor.address.country.trim() === selectedCountry;
    const matchState = !selectedState || labor.address.state.trim() === selectedState;
    const matchCity = !selectedCity || labor.address.city.trim() === selectedCity;
    const matchZipCode = !selectedZipCode || labor.address.postalCode.trim() === selectedZipCode;
    const matchCategory = !selectedCategory || labor.categories.includes(selectedCategory);
    const matchRating = !selectedRating || labor.rating >= selectedRating;

    return matchCountry && matchState && matchCity && matchZipCode && matchCategory && matchRating;
  });

  setFilteredLabors(filteredResults);
};

// Update filters dynamically when any filter changes
useEffect(() => {
  handleFiltersUpdate();
}, [selectedCountry, selectedState, selectedCity, selectedZipCode, selectedCategory, selectedRating, laborsList]);



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
                          <select id="city" className="w-full p-2 border rounded-md bg-white"
                          value={selectedCountry}
                          onChange={(e)=> setSelectedCountry(e.target.value)}
                          >
                            <option value="">Select country</option>
                            {country.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                          <select id="city" className="w-full p-2 border rounded-md bg-white"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          >
                            <option value="">Select state</option>
                            {state.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                          <select id="city" className="w-full p-2 border rounded-md bg-white"
                          value={selectedCity }
                          onChange={(e) => setSelectedCity(e.target.value)}
                          >
                            <option value="">Select City</option>
                            {cities.map((item , index)=>(
                              <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                          <select id="zipCode" className="w-full p-2 border rounded-md bg-white"
                          value={selectedZipCode}
                          onChange={(e) => setSelectedZipCode(e.target.value)}
                          >
                            <option value="">Select Zip Code</option>
                            {zipCodes.map((item, index) => (
                             <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                        </div>
                        {/* <button
                          onClick={handleFiltersUpdate}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Submit
                        </button> */}
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Service Category
                        </h2>
                        <select className="w-full p-2 border rounded-md bg-white"
                        value={selectedCategory}
                         onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option>Select Service</option>
                           <option value="electrician">Electrician</option>
                            <option value="plumber">Plumber</option>
                            <option value="cleaner">Cleaner</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="painter">Painter</option>
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
                              <input type="checkbox" className="w-4 h-4"
                              checked={selectedRating === rating}
                              onChange={() => setSelectedRating(rating)}
                              />
                              <label className="text-gray-600">
                                {rating} Star and up
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* <div className="space-y-4">
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
                      </div> */}

                      <button className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors" onClick={handleResetFilters}>
                        Reset Filters
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
                          <select id="city" className="w-full p-2 border rounded-md bg-white"
                          value={selectedCountry}
                          onChange={(e)=> setSelectedCountry(e.target.value)}
                          >
                            <option value="">Select country</option>
                            {country.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                          <select id="city" className="w-full p-2 border rounded-md bg-white"
                          value={selectedState}
                         onChange={(e) => setSelectedState(e.target.value)}
                          >
                            <option value="">Select state</option>
                            {state.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                          <select id="city" className="w-full p-2 border rounded-md bg-white"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          >
                            <option value="">Select City</option>
                            {cities.map((item , index)=>(
                              <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                          <select id="zipCode" className="w-full p-2 border rounded-md bg-white"
                          value={selectedZipCode}
                          onChange={(e) => setSelectedZipCode(e.target.value)}
                          >
                            <option value="">Select Zip Code</option>
                            {zipCodes.map((item, index) => (
                             <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                        </div>
                        {/* <button
                          onClick={handleFiltersUpdate}
                          className="px-4 py-2 bg-[#16a4c0f6] text-white rounded-md hover:bg-[#316670f6]"
                        >
                          Submit
                        </button> */}
                      </div>


                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Service Category
                        </h2>
                        <select className="w-full p-2 border rounded-md bg-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option>Select Service</option>
                          <option value="electrician">Electrician</option>
                            <option value="plumber">Plumber</option>
                            <option value="cleaner">Cleaner</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="painter">Painter</option>
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
                            <input 
                              type="checkbox" 
                              className="w-4 h-4" 
                              checked={selectedRating === rating}
                              onChange={() => 
                                setSelectedRating(prevRating => 
                                  prevRating === rating ? 0 : rating
                                )
                              }
                            />
                            <label className="text-gray-600">
                              {rating} Star and up
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
{/* 
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
                      </div> */}

                      <button className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors" onClick={handleResetFilters}>
                    Reset Filters
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
                        <h2 className="text-xl font-semibold  ">
                          Location
                        </h2>
                          <div className="space-y-3">
                          <select id="city" className="w-full p-2 border rounded-md bg-[#3abcba]"
                          value={selectedCountry}
                          onChange={(e)=> setSelectedCountry(e.target.value)}
                            >
                            <option value="">Select country</option>
                            {country.map((item, index) => (
                            <option value={item} key={index} className="bg-[#206261]">{item}</option>
                            ))}
                          </select>
                            <select id="city" className="w-full p-2 border rounded-md bg-[#3abcba]"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}  
                            >
                            <option value="">Select state</option>
                            {state.map((item, index) => (
                            <option value={item} key={index} className="bg-[#206261]">{item}</option>
                            ))}
                          </select>
                          <select id="city" className="w-full p-2 border rounded-md bg-[#3abcba]"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          >
                            <option value="">Select City</option>
                            {cities.map((item , index)=>(
                              <option value={item} key={index} className="bg-[#206261]">{item}</option>
                            ))}
                          </select>
                            <select id="zipCode" className="w-full p-2 border rounded-md bg-[#3abcba]"
                            value={selectedZipCode}
                            onChange={(e) => setSelectedZipCode(e.target.value)}
                            >
                            <option value="">Select Zip Code</option>
                            {zipCodes.map((item, index) => (
                             <option value={item} key={index} className="bg-[#206261]">{item}</option>
                            ))}
                          </select>
                        </div>
                        {/* <button
                          onClick={handleFiltersUpdate}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Submit
                        </button> */}
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">
                          Service Category
                        </h2>
                          <select className="w-full p-2 border rounded-md bg-[#3abcba]"
                          value={selectedCategory}
                         onChange={(e) => setSelectedCategory(e.target.value)}
                          >
                            <option>Select Service</option>
                            <option value="electrician">Electrician</option>
                            <option value="plumber">Plumber</option>
                            <option value="cleaner">Cleaner</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="painter">Painter</option>
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
                              <input type="checkbox" className="w-4 h-4"
                              checked={selectedRating === rating}
                              onChange={() => setSelectedRating(rating)}
                              />
                              <label className="">{rating} Star and up</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* <div className="space-y-4">
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
                      </div> */}

                      <button className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors" onClick={handleResetFilters}>
                        Reset Filters
                      </button>
                    </div>
                  )}

                  <div className="w-full lg:w-72 lg:sticky lg:top-8 lg:self-start hidden md:block sm:block">
                    <div className=" p-6 rounded-lg border border-gray-700 shadow-sm space-y-6 ">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold  ">
                          Location
                        </h2>
                          <div className="space-y-3">
                          <select id="city" className="w-full p-2 border rounded-md bg-[#3abcba]"
                          value={selectedCountry}
                          onChange={(e)=> setSelectedCountry(e.target.value)}
                            >
                            <option value="">Select country</option>
                            {country.map((item, index) => (
                            <option value={item} key={index} className="bg-[#206261]">{item}</option>
                            ))}
                          </select>
                          <select id="city" className="w-full p-2 border rounded-md bg-[#3abcba]"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          >
                            <option value="">Select state</option>
                            {state.map((item, index) => (
                            <option value={item} key={index} className="bg-[#206261]">{item}</option>
                            ))}
                          </select>
                            <select id="city" className="w-full p-2 border rounded-md bg-[#3abcba]"
                            value={selectedCity}
                             onChange={(e) => setSelectedCity(e.target.value)}
                            >
                            <option value="">Select City</option>
                            {cities.map((item , index)=>(
                              <option value={item} key={index} className="bg-[#206261]">{item}</option>
                            ))}
                          </select>
                            <select id="zipCode" className="w-full p-2 border rounded-md bg-[#3abcba]"
                            value={selectedZipCode}
                            onChange={(e) => setSelectedZipCode(e.target.value)}
                            >
                            <option value="">Select Zip Code</option>
                            {zipCodes.map((item, index) => (
                             <option value={item} key={index} className="bg-[#206261]">{item}</option>
                            ))}
                          </select>
                        </div>
                        {/* <button
                          onClick={handleFiltersUpdate}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Submit
                        </button> */}
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold ">
                          Service Category
                        </h2>
                        <select className="w-full p-2 border rounded-md bg-[#3abcba]"
                        value={selectedCategory}
                         onChange={(e) => setSelectedCategory(e.target.value)}
                          >
                            <option>Select Service</option>
                            <option value="electrician" className="bg-[#206261]">Electrician</option>
                            <option value="plumber" className="bg-[#206261]">Plumber</option>
                            <option value="cleaner" className="bg-[#206261]">Cleaner</option>
                            <option value="carpenter" className="bg-[#206261]">Carpenter</option>
                            <option value="painter" className="bg-[#206261]">Painter</option>
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
                              <input type="checkbox" className="w-4 h-4 " 
                              
                              checked={selectedRating === rating}
                              onChange={() => setSelectedRating(rating)}
                              />
                              <label className="">{rating} Star and up</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* <div className="space-y-4">
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
                      </div> */}

                      <button className="w-full bg-[#3abcba] text-white py-2 px-4 rounded-full hover:bg-[#25a7a5] transition-colors" onClick={handleResetFilters}>
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Right Content - Grid Layout */}
              <div className="flex-1">
                {theme === "light" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">

                    {laborsList.length === 0 ? (
                      <div className="text-center text-gray-500 py-10">
                       <img src={notFound} alt="" />
                      </div>
                    ) : filteredLabors.length === 0 ? (
                        <div className="text-center flex items-center text-gray-500 py-10">
                          {selectedCategory || selectedCountry || selectedState || selectedCity || selectedZipCode || selectedRating 
                            ? (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 400 300" 
                                className="mx-auto" 
                                style={{backgroundColor: '#f0f8ff'}}
                              >
                                <path d="M100 180 L80 220 Q100 240, 120 220 Z" fill="#cccccc" opacity="0.5"/>
                                <circle cx="100" cy="160" r="20" fill="#cccccc" opacity="0.5"/>
                                
                                <path d="M300 180 L280 220 Q300 240, 320 220 Z" fill="#cccccc" opacity="0.5"/>
                                <circle cx="300" cy="160" r="20" fill="#cccccc" opacity="0.5"/>
                                
                                <circle cx="200" cy="150" r="60" fill="none" stroke="#FF6B6B" strokeWidth="15"/>
                                <line x1="160" y1="190" x2="240" y2="110" stroke="#FF6B6B" strokeWidth="15"/>
                                
                                <circle cx="200" cy="150" r="40" fill="none" stroke="#888" strokeWidth="8"/>
                                <line x1="220" y1="170" x2="240" y2="190" stroke="#888" strokeWidth="8"/>
                                
                                <text 
                                  x="200" 
                                  y="250" 
                                  textAnchor="middle" 
                                  fontSize="20" 
                                  fill="#333" 
                                  fontWeight="bold"
                                >
                                  No Laborers Found
                                </text>
                                <text 
                                  x="200" 
                                  y="280" 
                                  textAnchor="middle" 
                                  fontSize="16" 
                                  fill="#666"
                                >
                                  Adjust your search filters
                                </text>
                              </svg>
                            )
                            : "Select filters to find laborers"}
                        </div>
                    ) : (
                      (filteredLabors.length > 0 ? filteredLabors : laborsList).map((user) => (
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
                          <div className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                          <p className="text-gray-600 mt-2 ">
                            I am {user?.firstName},<br></br> a highly skilled and experienced professional with over {user?.aboutMe?.experience} years of experience.
                            <p className="text-gray-600 truncate max-h-24 overflow-hidden">
                            {user?.aboutMe?.description}
                          </p>
                          </p>
                        </div>
                        </div>

                            
                        <div className="mt-4  self-end">
                            <button className="bg-[#3ab3bc] w-[200px] h-[34px] text-white py-1.5 px-4 rounded-md hover:bg-[#2d919a] transition-colors text-sm" onClick={() => handleNavigeProfilePage(user)}>
                              View Profile
                            </button>
                        </div>
                      </div>
                    ))
                    )}


                    {}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">

                   {laborsList.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                      No laborers available at the moment
                    </div>
                  ) : filteredLabors.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                      {selectedCategory || selectedCountry || selectedState || selectedCity || selectedZipCode || selectedRating 
                        ? "No laborers match your current filters" 
                        : "Select filters to find laborers"}
                    </div>
                  ) : (
                    (filteredLabors.length > 0 ? filteredLabors : laborsList).map((user) => (
                      <div
                        key={user.id}
                        className="p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col h-full"
                      >
                        <div className="w-full  h-96 mb-4">
                          <img
                            src={user.profilePicture}
                            alt={`${user.name} profile`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex flex-col flex-1 space-y-2">
                          <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                          <span className="text-lg ">{user.categories[0]}</span>
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
                         <div className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                          <p className=" mt-2 ">
                            I am {user?.firstName},<br></br> a highly skilled and experienced professional with over {user?.aboutMe?.experience} years of experience.
                            <p className=" truncate max-h-24 overflow-hidden">
                            {user?.aboutMe?.description}
                          </p>
                          </p>
                        </div>
                        </div>

                        <div className="mt-4 self-end">
                          {/* <Link to={"/labor/ProfilePage"}> */}
                            <button className="bg-[#16a4c0f6] w-[200px] h-[34px] text-white py-1.5 px-4 rounded-md hover:bg-[#397c89f6] transition-colors text-sm" onClick={() => handleNavigeProfilePage(user)}>
                              View Profile
                            </button>
                          {/* </Link> */}
                        </div>
                      </div>
                    ))
                  )} 


          
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
