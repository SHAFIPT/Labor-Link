import HomeNavBar from "../HomeNavBar";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useCallback, useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchLaborsByLocation } from "../../services/LaborServices";
import { resetUser, setAccessToken, setisUserAthenticated, setLoading, setLocationOfUser, setUser } from "../../redux/slice/userSlice";
import notFound from '../../assets/not Found labor.webp'
import { userFetch } from "../../services/UserSurvice";
import { resetLaborer, setIsLaborAuthenticated, setLaborer } from "../../redux/slice/laborSlice";
import Breadcrumb from "../BreadCrumb";
import '../Auth/LoadingBody.css'
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
const LaborListingPage = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const locationOfUser = useSelector(
    (state: RootState) => state.user.locationOfUser
  );

  //  const locationOfUse = useMemo(() => ({
  //   latitude: 11.151827,
  //   longitude:  75.894107
  //  }), []);

  const loading = useSelector((state: RootState) => state.user.loading);

  console.log("Thsi si the locationOfUser :",locationOfUser)

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZipCode, setSelectedZipCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [latLng, setLatLng] = useState({ lat: 12.9716, lng: 77.5946 });

  const [filteredLabors, setFilteredLabors] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [laborsList, setLaborsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState("desc");
  const currentPages = location.pathname.split("/").pop();
  // const itemsPerPage = 4;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("This is the laborsList", laborsList)

  {
    /* Define pagination variables */
  }
  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLabors = (
    filteredLabors.length > 0 ? filteredLabors : laborsList
  ).slice(startIndex, endIndex);
  const totalPages = Math.ceil(
    (filteredLabors.length > 0 ? filteredLabors : laborsList).length /
      itemsPerPage
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await userFetch();
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error("Your account has been blocked.");
          localStorage.removeItem("UserAccessToken");
          // Reset User State
          dispatch(setUser({}));
          dispatch(resetUser());
          dispatch(setisUserAthenticated(false));
          dispatch(setAccessToken(""));

          // Reset Labor State
          dispatch(setLaborer({}));
          dispatch(resetLaborer());
          dispatch(setIsLaborAuthenticated(false));
          navigate("/"); // Redirect to login page
        }
      }
    };

    fetchUser();
  }, [navigate, dispatch]);

  // useEffect(() => {
  //   const uniqueCountry = Array.from(
  //     new Set(laborsList.map((labor) => labor.address.country.trim()))
  //   );

  //   const uniqueState = Array.from(
  //     new Set(laborsList.map((labor) => labor.address.state.trim()))
  //   );

  //   const uniqueCities = Array.from(
  //     new Set(laborsList.map((labor) => labor.address.city.trim()))
  //   );

  //   const uniqueZipCodes = Array.from(
  //     new Set(laborsList.map((labor) => labor.address.postalCode.trim()))
  //   );

  //   console.log("This is the cities..... ++++ ---- .", uniqueCities);

  //   SetCountry(uniqueCountry);
  //   setState(uniqueState);
  //   setCities(uniqueCities);
  //   setZipCodes(uniqueZipCodes);
  // }, [laborsList]);

  console.log("Thsi sis the laborsList :  ++++++ ====-- --- -- ", laborsList);
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const fetchLabors = useCallback(async () => {
  if (!locationOfUser?.latitude || !locationOfUser?.longitude) return;

  dispatch(setLoading(true));

  try {
    const response = await fetchLaborsByLocation({
      latitude: locationOfUser.latitude,
      longitude: locationOfUser.longitude,
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      zipCode: selectedZipCode,
      category: selectedCategory,
      rating: selectedRating,
      sortOrder,
    });

    if (response.status === 200) {
      console.log("Labor fetched successfully: ", response.data);
      dispatch(setLoading(false));
      setLaborsList(response.data.laborers);
    } else {
      toast.error("Error in labor fetching");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error in labor fetching");
  } finally {
    dispatch(setLoading(false));
  }
}, [locationOfUser, selectedCountry, selectedState, selectedCity, selectedZipCode, selectedCategory, selectedRating, sortOrder, dispatch]);

// Use Effect to call fetchLabors when location updates
  useEffect(() => {
   console.log('Kyu3333333333333333333333333llllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$$############################')
  fetchLabors();
}, [fetchLabors]);

  const handleNavigeProfilePage = (user) => {

    navigate("/labor/ProfilePage", { state: user });
  };

  const handleResetFilters = () => {
    // Reset all filter states to their initial values
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedZipCode("");
    setSelectedCategory("");
    setSelectedRating(0);

    // Clear filtered labors to show all labors
    setFilteredLabors([]);
  };

  // laborsList.map((labor) => {
  //   labor.firstName
  // })

  //   const handleFiltersUpdate = () => {
  //   const filteredResults = laborsList.filter(labor => {
  //     const matchCountry = !selectedCountry || labor.address.country.trim() === selectedCountry;
  //     const matchState = !selectedState || labor.address.state.trim() === selectedState;
  //     const matchCity = !selectedCity || labor.address.city.trim() === selectedCity;
  //     const matchZipCode = !selectedZipCode || labor.address.postalCode.trim() === selectedZipCode;
  //     const matchCategory = !selectedCategory || labor.categories.includes(selectedCategory);
  //     const matchRating = !selectedRating || labor.rating >= selectedRating;

  //     return matchCountry && matchState && matchCity && matchZipCode && matchCategory && matchRating;
  //   });

  //   setFilteredLabors(filteredResults);
  // };

  // // Update filters dynamically when any filter changes
  // useEffect(() => {
  //   handleFiltersUpdate();
  // }, [selectedCountry, selectedState, selectedCity, selectedZipCode, selectedCategory, selectedRating, laborsList]);

  // First, fetch Firebase users to create email to UID mapping

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "LaborListing Page", link: null }, // No link for the current page
  ];



  const LocationMap = ({ setLatLng, latLng }) => {
  const dispatch = useDispatch();

  useMapEvents({
    click(e) {
      const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
      setLatLng(newLocation);
      dispatch(setLocationOfUser({ latitude: e.latlng.lat, longitude: e.latlng.lng }));
    },
  });

  return latLng.lat && latLng.lng ? <Marker position={[latLng.lat, latLng.lng]} /> : null;
};

  return (
    <>
      {loading && <div className="loader"></div>}
      <div>
        <HomeNavBar />
        <div className="min-h-screen ">
          <div className="container mx-auto max-w-7xl px-4">
            <Breadcrumb items={breadcrumbItems} currentPage={currentPages} />
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
                          {/* Country Select */}
                          <select
                            id="country"
                            className="w-full p-2 border rounded-md bg-white"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="Canada">Canada</option>
                          </select>

                          {/* State Select */}
                          <select
                            id="state"
                            className="w-full p-2 border rounded-md bg-white"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                          >
                            <option value="">Select State</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="California">California</option>
                            <option value="Texas">Texas</option>
                            <option value="Ontario">Ontario</option>
                          </select>

                          {/* City Input */}
                          <input
                            type="text"
                            id="city"
                            className="w-full p-2 border rounded-md bg-white"
                            placeholder="Enter City"
                            value={selectedCity}
                            onChange={(e) =>
                              setSelectedCity(e.target.value.trim())
                            } // Trim spaces
                            autoCapitalize="off" // Prevent auto-capitalization on mobile
                            spellCheck={false} // Avoid auto-correction
                          />

                          {/* Zip Code Input */}
                          <input
                            type="text"
                            id="zipCode"
                            className="w-full p-2 border rounded-md bg-white"
                            placeholder="Enter Zip Code"
                            value={selectedZipCode}
                            onChange={(e) => setSelectedZipCode(e.target.value)}
                          />
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
                        <select
                          className="w-full p-2 border rounded-md bg-white"
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
                        <h2 className="text-xl font-semibold">
                          Sort by Rating
                        </h2>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="w-4 h-4"
                              checked={sortOrder === "asc"}
                              onChange={() => setSortOrder("asc")}
                            />
                            <label className="">Low to High</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="w-4 h-4"
                              checked={sortOrder === "desc"}
                              onChange={() => setSortOrder("desc")}
                            />
                            <label className="">High to Low</label>
                          </div>
                        </div>
                      </div>

                      {/* Map Section */}
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Select Location</h2>
                          <MapContainer
                            center={[12.9716, 77.5946]} // Default to Bangalore
                            zoom={13}
                            style={{ height: "300px", width: "100%" }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMap setLatLng={setLatLng} latLng={latLng} />
                          </MapContainer>
                          {/* <p className="text-center mt-2">
                            Selected Coordinates: {latLng.lat}, {latLng.lng}
                          </p> */}
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

                      <button
                        className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors"
                        onClick={handleResetFilters}
                      >
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
                          {/* Country Select */}
                          <select
                            id="country"
                            className="w-full p-2 border rounded-md bg-white"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="Canada">Canada</option>
                          </select>

                          {/* State Select */}
                          <select
                            id="state"
                            className="w-full p-2 border rounded-md bg-white"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                          >
                            <option value="">Select State</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="California">California</option>
                            <option value="Texas">Texas</option>
                            <option value="Ontario">Ontario</option>
                          </select>

                          {/* City Input */}
                          <input
                            type="text"
                            id="city"
                            className="w-full p-2 border rounded-md bg-white"
                            placeholder="Enter City"
                            value={selectedCity}
                            onChange={(e) =>
                              setSelectedCity(e.target.value.trim())
                            } // Trim spaces
                            autoCapitalize="off" // Prevent auto-capitalization on mobile
                            spellCheck={false} // Avoid auto-correction
                          />

                          {/* Zip Code Input */}
                          <input
                            type="text"
                            id="zipCode"
                            className="w-full p-2 border rounded-md bg-white"
                            placeholder="Enter Zip Code"
                            value={selectedZipCode}
                            onChange={(e) => setSelectedZipCode(e.target.value)}
                          />
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
                        <select
                          className="w-full p-2 border rounded-md bg-white"
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
                        <h2 className="text-xl font-semibold">
                          Sort by Rating
                        </h2>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="w-4 h-4"
                              checked={sortOrder === "asc"}
                              onChange={() => setSortOrder("asc")}
                            />
                            <label className="">Low to High</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="w-4 h-4"
                              checked={sortOrder === "desc"}
                              onChange={() => setSortOrder("desc")}
                            />
                            <label className="">High to Low</label>
                          </div>
                        </div>
                      </div>
                      {/* Map Section */}
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Select Location</h2>
                          <MapContainer
                            center={[12.9716, 77.5946]} // Default to Bangalore
                            zoom={13}
                            style={{ height: "300px", width: "100%" }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMap setLatLng={setLatLng} latLng={latLng} />
                          </MapContainer>
                          <p className="text-center mt-2">
                            Selected Coordinates: {latLng.lat}, {latLng.lng}
                          </p>
                        </div>
                      <button
                        className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors"
                        onClick={handleResetFilters}
                      >
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
                    <div className="w-full  p-6 rounded-lg shadow-sm border  space-y-6 mt-4">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold  ">Location</h2>
                        <div className="space-y-3">
                          {/* Country Select */}
                          <select
                            id="country"
                            className="w-full p-2 border rounded-md bg-[#17b1a7] "
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="Canada">Canada</option>
                          </select>

                          {/* State Select */}
                          <select
                            id="state"
                            className="w-full p-2 border rounded-md bg-[#17b1a7] "
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                          >
                            <option value="">Select State</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="California">California</option>
                            <option value="Texas">Texas</option>
                            <option value="Ontario">Ontario</option>
                          </select>

                          {/* City Input */}
                          <input
                            type="text"
                            id="city"
                            className="w-full p-2 border rounded-md bg-[#17b1a7] "
                            placeholder="Enter City"
                            value={selectedCity}
                            onChange={(e) =>
                              setSelectedCity(e.target.value.trim())
                            } // Trim spaces
                            autoCapitalize="off" // Prevent auto-capitalization on mobile
                            spellCheck={false} // Avoid auto-correction
                          />

                          {/* Zip Code Input */}
                          <input
                            type="text"
                            id="zipCode"
                            className="w-full p-2 border rounded-md bg-[#17b1a7] "
                            placeholder="Enter Zip Code"
                            value={selectedZipCode}
                            onChange={(e) => setSelectedZipCode(e.target.value)}
                          />
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
                        <select
                          className="w-full p-2 border rounded-md bg-[#3abcba]"
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
                        <h2 className="text-xl font-semibold">
                          Sort by Rating
                        </h2>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="w-4 h-4"
                              checked={sortOrder === "asc"}
                              onChange={() => setSortOrder("asc")}
                            />
                            <label className="">Low to High</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="w-4 h-4"
                              checked={sortOrder === "desc"}
                              onChange={() => setSortOrder("desc")}
                            />
                            <label className="">High to Low</label>
                          </div>
                        </div>
                        </div>
                        
                        {/* Map Section */}
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Select Location</h2>
                          <MapContainer
                            center={[12.9716, 77.5946]} // Default to Bangalore
                            zoom={13}
                            style={{ height: "300px", width: "100%" }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMap setLatLng={setLatLng} latLng={latLng} />
                          </MapContainer>
                          {/* <p className="text-center mt-2">
                            Selected Coordinates: {latLng.lat}, {latLng.lng}
                          </p> */}
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

                      <button
                        className="w-full bg-[#16a4c0f6] text-white py-2 px-4 rounded-full hover:bg-[#16a4c0f6] transition-colors"
                        onClick={handleResetFilters}
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}

                  <div className="w-full lg:w-72 lg:sticky lg:top-8 lg:self-start hidden md:block sm:block">
                    <div className=" p-6 rounded-lg border border-gray-700 shadow-sm space-y-6 ">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold  ">Location</h2>
                        <div className="space-y-3">
                          {/* Country Select */}
                          <select
                            id="country"
                            className="w-full p-2 border rounded-md bg-[#3abcba]"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="Canada">Canada</option>
                          </select>

                          {/* State Select */}
                          <select
                            id="state"
                            className="w-full p-2 border rounded-md bg-[#3abcba]"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                          >
                            <option value="">Select State</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="California">California</option>
                            <option value="Texas">Texas</option>
                            <option value="Ontario">Ontario</option>
                          </select>

                          {/* City Input */}
                          <input
                            type="text"
                            id="city"
                            className="w-full p-2 border rounded-md bg-[#3abcba]"
                            placeholder="Enter City"
                            value={selectedCity}
                            onChange={(e) =>
                              setSelectedCity(e.target.value.trim())
                            } // Trim spaces
                            autoCapitalize="off" // Prevent auto-capitalization on mobile
                            spellCheck={false} // Avoid auto-correction
                          />

                          {/* Zip Code Input */}
                          <input
                            type="text"
                            id="zipCode"
                            className="w-full p-2 border rounded-md bg-[#3abcba]"
                            placeholder="Enter Zip Code"
                            value={selectedZipCode}
                            onChange={(e) => setSelectedZipCode(e.target.value)}
                          />
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
                        <select
                          className="w-full p-2 border rounded-md bg-[#3abcba]"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option>Select Service</option>
                          <option value="electrician" className="bg-[#206261]">
                            Electrician
                          </option>
                          <option value="plumber" className="bg-[#206261]">
                            Plumber
                          </option>
                          <option value="cleaner" className="bg-[#206261]">
                            Cleaner
                          </option>
                          <option value="carpenter" className="bg-[#206261]">
                            Carpenter
                          </option>
                          <option value="painter" className="bg-[#206261]">
                            Painter
                          </option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">
                          Sort by Rating
                        </h2>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="w-4 h-4"
                              checked={sortOrder === "asc"}
                              onChange={() => setSortOrder("asc")}
                            />
                            <label className="">Low to High</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="w-4 h-4"
                              checked={sortOrder === "desc"}
                              onChange={() => setSortOrder("desc")}
                            />
                            <label className="">High to Low</label>
                          </div>
                        </div>
                        </div>
                        

                        {/* Map Section */}
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Select Location</h2>
                          <MapContainer
                            center={[12.9716, 77.5946]} // Default to Bangalore
                            zoom={13}
                            style={{ height: "300px", width: "100%" }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMap setLatLng={setLatLng} latLng={latLng} />
                          </MapContainer>
                          {/* <p className="text-center mt-2">
                            Selected Coordinates: {latLng.lat}, {latLng.lng}
                          </p> */}
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

                      <button
                        className="w-full bg-[#3abcba] text-white py-2 px-4 rounded-full hover:bg-[#25a7a5] transition-colors"
                        onClick={handleResetFilters}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Right Content - Grid Layout */}
              <div className="flex-1">
                {theme === "light" ? (
                  <div className="flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                      {laborsList.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                          <img src={notFound} alt="" />
                        </div>
                      ) : laborsList.length === 0 ? (
                        <div className="text-center flex items-center text-gray-500 py-10">
                          {selectedCategory ||
                          selectedCountry ||
                          selectedState ||
                          selectedCity ||
                          selectedZipCode ||
                          selectedRating ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 400 300"
                              className="mx-auto"
                              style={{ backgroundColor: "#f0f8ff" }}
                            >
                              <path
                                d="M100 180 L80 220 Q100 240, 120 220 Z"
                                fill="#cccccc"
                                opacity="0.5"
                              />
                              <circle
                                cx="100"
                                cy="160"
                                r="20"
                                fill="#cccccc"
                                opacity="0.5"
                              />

                              <path
                                d="M300 180 L280 220 Q300 240, 320 220 Z"
                                fill="#cccccc"
                                opacity="0.5"
                              />
                              <circle
                                cx="300"
                                cy="160"
                                r="20"
                                fill="#cccccc"
                                opacity="0.5"
                              />

                              <circle
                                cx="200"
                                cy="150"
                                r="60"
                                fill="none"
                                stroke="#FF6B6B"
                                strokeWidth="15"
                              />
                              <line
                                x1="160"
                                y1="190"
                                x2="240"
                                y2="110"
                                stroke="#FF6B6B"
                                strokeWidth="15"
                              />

                              <circle
                                cx="200"
                                cy="150"
                                r="40"
                                fill="none"
                                stroke="#888"
                                strokeWidth="8"
                              />
                              <line
                                x1="220"
                                y1="170"
                                x2="240"
                                y2="190"
                                stroke="#888"
                                strokeWidth="8"
                              />

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
                          ) : (
                            "Select filters to find laborers"
                          )}
                        </div>
                      ) : (
                        currentLabors.map((user) => {
                          // Declare variables here, before the JSX
                          return (
                            <div
                              key={user._id}
                              className="p-6 rounded-lg shadow-lg flex flex-col h-full relative"
                            >
                              {/* Notification Badge */}
                              {/* Notification Badge - Only show when there are unread messages */}

                                                                                                            {/* hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee     */}

                              {/* {hasUnread && (
                                <div className="absolute top-0 right-2 z-20">
                                  <div className="relative">
                                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center absolute -top-0 -right-5">
                                      <i className="fas fa-bell text-white text-xs"></i>
                                    </div>
                                    <div className="w-5 h-5 bg-red-500 rounded-full absolute animate-ping opacity-75"></div>
                                  </div>
                                </div>
                              )} */}

                              <div className="w-full h-96 mb-4">
                                <img
                                  src={user.profilePicture}
                                  alt={`${user.firstName} profile`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>

                              <div className="flex flex-col flex-1 space-y-2">
                                <h2 className="text-xl font-semibold">
                                  {user.firstName} {user.lastName}
                                </h2>
                                <span className="text-lg text-gray-600">
                                  {user.categories[0]}
                                </span>
                                <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.round(user.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">
                                  {user.rating.toFixed(1)} ({user.reviews?.length || 0} reviews)
                                </span>
                              </div>
                                <div className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                                  <p className="text-gray-600 mt-2">
                                    I am {user?.firstName},<br />a highly
                                    skilled and experienced professional with
                                    over {user?.aboutMe?.experience} years of
                                    experience.
                                    <p className="text-gray-600 truncate max-h-24 overflow-hidden">
                                      {user?.aboutMe?.description}
                                    </p>
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 self-end">
                                <button
                                  className="bg-[#3ab3bc] w-[200px] h-[34px] text-white py-1.5 px-4 rounded-md hover:bg-[#2d919a] transition-colors text-sm"
                                  onClick={() => handleNavigeProfilePage(user)}
                                >
                                  View Profile
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {(laborsList.length > 0 || laborsList.length > 0) && (
                      <div className="flex justify-center gap-4 mt-6">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-4 py-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                      {laborsList.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                          No laborers available at the moment
                        </div>
                      ) : laborsList.length === 0  ? (
                        <div className="text-center text-gray-500 py-10">
                          {selectedCategory ||
                          selectedCountry ||
                          selectedState ||
                          selectedCity ||
                          selectedZipCode ||
                          selectedRating
                            ? "No laborers match your current filters"
                            : "Select filters to find laborers"}
                        </div>
                      ) : (
                        currentLabors.map((user) => {
                          return (
                            <div
                              key={user.id}
                              className="p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col h-full"
                            >
                              {/* Notification Badge */}
                             

                              {/* Chat Status Indicator */}
                              {/* {hasChat && (
                                <div className="absolute top-4 left-4 z-10 max-w-[200px]">
                                  <div className="bg-blue-500 text-white text-xs px-3 py-2 rounded-lg">
                                    <div className="font-semibold mb-1">Active Chat</div>
                                    {hasUnread && (
                                      <div className="text-xs truncate">
                                        Last: {unreadMessages[laborFirebaseUid].lastMessage}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )} */}

                              <div className="w-full  h-96 mb-4">
                                <img
                                  src={user.profilePicture}
                                  alt={`${user.name} profile`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>

                              <div className="flex flex-col flex-1 space-y-2">
                                <h2 className="text-xl font-semibold">
                                  {user.firstName} {user.lastName}
                                </h2>
                                <span className="text-lg ">
                                  {user.categories[0]}
                                </span>
                                <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.round(user.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">
                                  {user.rating.toFixed(1)} ({user.reviews?.length || 0} reviews)
                                </span>
                              </div>
                                <div className="text-sm sm:text-base md:text-lg lg:text-[12px]">
                                  <p className=" mt-2 ">
                                    I am {user?.firstName},<br></br> a highly
                                    skilled and experienced professional with
                                    over {user?.aboutMe?.experience} years of
                                    experience.
                                    <p className=" truncate max-h-24 overflow-hidden">
                                      {user?.aboutMe?.description}
                                    </p>
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 self-end">
                                {/* <Link to={"/labor/ProfilePage"}> */}
                                <button
                                  className="bg-[#16a4c0f6] w-[200px] h-[34px] text-white py-1.5 px-4 rounded-md hover:bg-[#397c89f6] transition-colors text-sm"
                                  onClick={() => handleNavigeProfilePage(user)}
                                >
                                  View Profile
                                </button>
                                {/* </Link> */}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {(laborsList.length > 0 || laborsList.length > 0) && (
                      <div className="flex justify-center gap-4 mt-6">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-4 py-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className="px-4 py-2 bg-[#3ab3bc] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
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
