  import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { validateAddress, validateFirstName, validatePhoneNumbers, validatePlace, validatePostalCode } from "../../utils/laborRegisterValidators";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../redux/slice/userSlice";
import { RootState } from "../../redux/store/store";
import { Dispatch, SetStateAction } from "react";
import { Icon } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface UserAddress {
  name?: string;
  city?: string;
  address?: string;
  phone?: string;
  pincode?: string;
  place?: string;
  district?: string; // Add district if needed
  latitude?: number | null; // Allow null
  longitude?: number | null; // Allow null
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  userAddress: UserAddress;
  setUserAddress: Dispatch<SetStateAction<UserAddress>>;
}

const AddressModal = ({ isOpen, onClose, onSubmit, userAddress, setUserAddress }: AddressModalProps) => {
  const dispatch = useDispatch();
  const error: {
    name?: string;
    city?: string;
    address?: string;
    phone?: string;
    picode?: string;
    place?: string;
  } = useSelector((state: RootState) => state.user.error);

  // Validate Fields Function
   const validateFields = () => {
    const errors = {
      name: validateFirstName(userAddress.name),
      phone: validatePhoneNumbers(userAddress.phone),
      address: validateAddress(userAddress.address),
      picode: validatePostalCode(userAddress.pincode),
      place: validatePlace(userAddress.place),
    };

    // Dispatching the error object to Redux
    dispatch(setError(errors));

    // Return true if no errors, otherwise false
    return Object.values(errors).every((error) => error === null || error === undefined);
  };

  console.log('This is are the errorr showing;;;; ',error)

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddress({ ...userAddress, [e.target.name]: e.target.value });
  };


  // Component to handle map click and set latitude/longitude
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setUserAddress({
          ...userAddress,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });

    const defaultIcon = new Icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    return userAddress.latitude !== undefined && userAddress.longitude !== undefined ? (
      <Marker position={[userAddress.latitude ?? 0, userAddress.longitude ?? 0]} icon={defaultIcon} />
    ) : null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault(); // ✅ Prevents default form submission behavior

  // Validate fields before submit
  if (validateFields()) {
    onSubmit(event); // ✅ Pass event to onSubmit function
    onClose();
    dispatch(setError({}));
  }
};

  const handleCancelation = () => {
    dispatch(setError({}));
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 flex flex-col overflow-y-auto max-h-[calc(100vh-4rem)]">
          {/* Header */}
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Enter Your Address
          </h2>
          <p className="text-gray-600 text-center">
            This is the address where the labor will reach out.
          </p>

          {/* Input Fields */}
          <div className="mt-4 space-y-3 ">
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              value={userAddress.name}
              onChange={handleChange}
              className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error?.name && (
              <p className="text-red-500 text-sm mt-1">{error.name}</p>
            )}

            <input
              type="text"
              name="phone"
              placeholder="Enter your Phone Number"
              value={userAddress.phone}
              onChange={handleChange}
              className="w-full p-2 border text-black border-gray-300 rounded-md"
            />
            {error?.phone && (
              <p className="text-red-500 text-sm mt-1">{error.phone}</p>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                name="district"
                placeholder="District"
                value={userAddress.city}
                onChange={handleChange}
                className="w-1/2 p-2 border text-black border-gray-300 rounded-md"
              />
              {error?.city && (
                <p className="text-red-500 text-sm mt-1">{error.city}</p>
              )}

              <input
                type="text"
                name="place"
                placeholder="Place"
                value={userAddress.place}
                onChange={handleChange}
                className="w-1/2 p-2 border text-black border-gray-300 rounded-md"
              />
              {error?.place && (
                <p className="text-red-500 text-sm mt-1">{error.place}</p>
              )}
            </div>

            <input
              type="text"
              name="address"
              placeholder="Full Address"
              value={userAddress.address}
              onChange={handleChange}
              className="w-full p-2 border text-black border-gray-300 rounded-md"
            />
            {error?.address && (
              <p className="text-red-500 text-sm mt-1">{error.address}</p>
            )}

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={userAddress.pincode}
              onChange={handleChange}
              className="w-full p-2 border text-black border-gray-300 rounded-md"
            />
            {error?.picode && (
              <p className="text-red-500 text-sm mt-1">{error.picode}</p>
            )}
          </div>

          {/* Map Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Select the Location where the Labor want to reach
            </h3>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <MapContainer
                center={[12.9716, 77.5946]} // Default location (Bangalore)
                zoom={12}
                style={{ height: "200px", width: "100%" }}
                className="rounded-md"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex justify-between">
            <button
              onClick={handleCancelation}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <form onSubmit={handleSubmit}>
              <button
                type="submit" // ✅ Ensures it triggers the form submission event
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Confirm Address
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default AddressModal;
