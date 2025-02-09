import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setLocationOfUser } from '../../redux/slice/userSlice'
import locationImage from '../../assets/locationImage2.jpg'
import locationImage1 from '../../assets/locationImage2-removebg-preview.png'
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store/store";
import MapSelector from "./MapSelector";
const LocationPrompt = ({ setShowLocationModal}) => {
  const theam = useSelector((state: RootState) => state.theme.mode)
  const [error, setError] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocationOfUser({ latitude, longitude }));
          setShowLocationModal(false); // Close the modal after location is granted
          setError(''); // Clear any previous error
          navigate('/laborListing');
        },
        (err) => {
          setError('Unable to access location. Please enable location services.');
        },
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <>
    {theam == 'light' ? (
      
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-[440px] w-full">
        {/* Image Section */}
        <div className="flex justify-center mb-4">
          <img
            src={locationImage} // Replace with your image URL
            alt="Location"
            className="w-52 h-52 object-cover rounded-"
          />
        </div>
        <h1 className="text-[26px] font-bold text-center mb-4">
          Allow Your Location
        </h1>

        {/* Text Section */}
        <h2 className="text-[15px] font-semibold text-center mb-4">
          We'll use your location to find laborers relevant to you
        </h2>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            We need access to your location to provide better recommendations.
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Buttons Section */}
        <div className="flex flex-col space-y-2 justify-around">
          <button
            onClick={getUserLocation}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
          >
            Allow My Current Location
          </button>
          <button
            onClick={() => setShowMapModal(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Select My Location
          </button>
          <button
            onClick={() => setShowLocationModal(false)}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Maybe Later
          </button>
        </div>
      </div>
      {showMapModal && <MapSelector setShowMapModal={setShowMapModal} onClose={()=>setShowLocationModal(false)} />}
    </div>
    ):(
   <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
  <div className="bg-gray-800 p-6 rounded-lg max-w-[440px] w-full shadow-lg">
    {/* Image Section */}
    <div className="flex justify-center mb-4">
      <img
        src={locationImage1} // Replace with your image URL
        alt="Location"
        className="w-52 h-52 object-cover rounded-lg"
      />
    </div>

    {/* Title */}
    <h1 className="text-[26px] font-bold text-center mb-4 text-white">
      Allow Your Location
    </h1>

    {/* Text Section */}
    <h2 className="text-[15px] font-semibold text-center mb-4 text-gray-300">
      We'll use your location to find laborers relevant to you
    </h2>

    <div className="text-center mb-4">
      <p className="text-sm text-gray-400">
        We need access to your location to provide better recommendations.
      </p>
    </div>

    {/* Error Message */}
    {error && <p className="text-red-400 text-center mb-4">{error}</p>}

    {/* Buttons Section */}
    <div className="flex flex-col space-y-2 justify-around">
      <button
        onClick={getUserLocation}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 focus:outline-none"
      >
        Allow My Current Location
      </button>
      <button
        onClick={() => setShowMapModal(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 focus:outline-none"
      >
        Select My Location
      </button>
      <button
        onClick={() => setShowLocationModal(false)}
        className="bg-gray-600 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-500 focus:outline-none"
      >
        Maybe Later
      </button>
    </div>
  </div>
  {showMapModal && (
    <MapSelector
      setShowMapModal={setShowMapModal}
      onClose={() => setShowLocationModal(false)}
    />
  )}
</div>

    )}  
    </>
  );
};

export default LocationPrompt;
