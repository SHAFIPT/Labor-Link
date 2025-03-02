import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Calendar, Clock, AlertCircle, Star, User, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { FaBriefcase } from 'react-icons/fa';
import { setLoading } from '../../redux/slice/userSlice';
import { toast } from 'react-toastify';
import { fetchLaobrs } from '../../services/LaborServices';

interface Labor {
  _id: string;
  aboutMe: {
    description: string;
  };
  firstName: string;
  lastName: string;
  rating: number;
  phone: string; // Add this if phone is part of the data structure
  location: {
    coordinates: [number, number]; // Latitude and Longitude
  };
  category: string;
  description: string;
  totalJobs: number;
  profilePicture: string;
  categories: string[];
  // Add other fields as necessary
}

type Cancellation = {
  canceledBy: string;
  reason: string;
  canceledAt: string;
  comments: string;
};

type Booking = {
  bookingId: string;
  cancellation: Cancellation;
  laborId: Labor;
  addressDetails: {
    name: string;
    phone: string;
    address: string;
    place: string;
    district: string;
  };
  quote: {
    arrivalTime: string;
  };
};

interface CancellationModalProps {
  booking: Booking;  // Typing the booking prop
  onClose: () => void;
  isOpen: boolean;
}

const CancellationModal = ({ booking, onClose, isOpen }: CancellationModalProps) => {
    const navigate = useNavigate();
    const dispath = useDispatch()
    const theam = useSelector((state: RootState) => state.theme.mode);
    const [similorLabors , setSimilorLabors] = useState<Labor[]>([])
    console.log("Booking is this", booking)
    
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmeeeeeee",similorLabors)


    console.log("HHHHHHHHHHHHHHHHHH",booking?.laborId.location?.coordinates[1])

  useEffect(() => {
       console.log('Kyu3333333333333333333333333llllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$$############################')
        const fetchSimilaorLabors = async () => {
            dispath(setLoading(true))
            try {
                 const fetchedLabor = await fetchLaobrs({
                    latitude: booking?.laborId?.location?.coordinates[1], // Corrected
                    longitude: booking?.laborId?.location.coordinates[0], // Corrected
                    categorie: booking?.laborId?.categories[0], // Corrected
                    laborId: booking?.laborId?._id
                 });
                // console.log("Thsi sit eh fetched :::",fetchedLabor)
            if (fetchedLabor.status === 200) {
                setSimilorLabors(fetchedLabor.data.labors)
                // toast.success("labor fetched succeff")
            }
            } catch (error) {
                console.error(error)
                toast.error("Errro is fetch labors.....")
            } finally {
                dispath(setLoading(false))
            }
        }

        fetchSimilaorLabors();
    },[])



   const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {theam == "light" ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative w-full max-w-5xl mx-4 bg-white rounded-xl shadow-2xl max-h-[100vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-8 border-b pb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Booking Cancellation Details
                </h1>
                <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Booking Details */}
                <div className="lg:col-span-2">
                  {/* Cancellation Alert */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-red-800">
                          Booking Cancelled by {booking.cancellation.canceledBy}
                        </h3>
                        <p className="text-red-700">
                          Reason: {booking.cancellation.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Labor Details */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Labor Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            {booking.laborId.firstName}{" "}
                            {booking.laborId.lastName}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            {booking.laborId.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaBriefcase  className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            {booking.laborId.categories[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timing Details */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Timing Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            Cancelled:{" "}
                            {formatDate(booking.cancellation.canceledAt)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            Scheduled: {formatDate(booking.quote.arrivalTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Address Details
                    </h3>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.addressDetails.name}
                        </p>
                        <p className="text-gray-700">
                          {booking.addressDetails.phone}
                        </p>
                        <p className="text-gray-700">
                          {booking.addressDetails.address}
                        </p>
                        <p className="text-gray-700">
                          {booking.addressDetails.place},{" "}
                          {booking.addressDetails.district}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Comments */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Cancellation Comments
                    </h3>
                    <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200">
                      {booking.cancellation.comments}
                    </p>
                  </div>
                </div>

                {/* Right Column - Similar Labors */}
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Similar Available Labors
                  </h2>
                  <div className="space-y-4">
                    {similorLabors.map((labor) => (
                      <div
                        key={labor?._id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/labor/ProfilePage`, { state: labor })}
                      >
                        <div className="flex items-center mb-3">
                          <div className="bg-white p-0 rounded-full">
                            <img
                            src={labor?.profilePicture}
                            alt="Profile"
                            className="rounded-full w-10 h-10 object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold">{labor?.firstName}</h3>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-gray-600 text-sm">
                                {labor?.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mb-2">
                          {labor?.categories[0]}
                        </span>
                         <p className="text-gray-900 text-sm mb-2">
                            {labor?.aboutMe?.description?.length > 100
                                ? `${labor?.aboutMe?.description?.slice(0, 100)}...`
                                : labor?.aboutMe?.description}
                            </p>
                        <p className="text-sm text-gray-500">
                          {labor?.totalJobs} jobs completed
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate("/laborList")}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    View All Available Labors
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative w-full max-w-5xl mx-4 bg-gray-900 text-white rounded-xl shadow-lg max-h-[100vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-8 border-b pb-6 border-gray-700">
                <h1 className="text-3xl font-bold text-[#32eae0] mb-2">
                  Booking Cancellation Details
                </h1>
                <p className="text-gray-400">Booking ID: {booking.bookingId}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Booking Details */}
                <div className="lg:col-span-2">
                  {/* Cancellation Alert */}
                  <div className="bg-red-800 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-red-200">
                          Booking Cancelled by {booking.cancellation.canceledBy}
                        </h3>
                        <p className="text-red-300">
                          Reason: {booking.cancellation.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Labor Details */}
                    <div className="bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-gray-300">
                        Labor Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-200">
                            {booking.laborId.firstName}{" "}
                            {booking.laborId.lastName}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-200">
                            {booking.laborId.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaBriefcase  className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-200">
                            {booking.laborId.categories[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timing Details */}
                    <div className="bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-gray-300">
                        Timing Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-200">
                            Cancelled:{" "}
                            {formatDate(booking.cancellation.canceledAt)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-200">
                            Scheduled: {formatDate(booking.quote.arrivalTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">
                      Address Details
                    </h3>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-200">
                          {booking.addressDetails.name}
                        </p>
                        <p className="text-gray-300">
                          {booking.addressDetails.phone}
                        </p>
                        <p className="text-gray-300">
                          {booking.addressDetails.address}
                        </p>
                        <p className="text-gray-300">
                          {booking.addressDetails.place},{" "}
                          {booking.addressDetails.district}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Comments */}
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">
                      Cancellation Comments
                    </h3>
                    <p className="text-gray-200 bg-gray-700 p-4 rounded-lg border border-gray-600">
                      {booking.cancellation.comments}
                    </p>
                  </div>
                </div>

                {/* Right Column - Similar Labors */}
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-bold text-gray-300 mb-4">
                    Similar Available Labors
                  </h2>
                  <div className="space-y-4">
                    {similorLabors.map((labor) => (
                      <div
                        key={labor?._id}
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => navigate(`/labor/ProfilePage`, { state: labor })}
                      >
                        <div className="flex items-center mb-3">
                           <div className="bg-white p-0 rounded-full">
                            <img
                            src={labor?.profilePicture}
                            alt="Profile"
                            className="rounded-full w-10 h-10 object-cover"
                            />
                        </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-200">
                              {labor?.firstName}
                            </h3>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-gray-300 text-sm">
                                {labor?.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mb-2">
                          {labor?.categories[0]}
                        </span>
                        <p className="text-gray-200 text-sm mb-2">
                            {labor?.aboutMe?.description?.length > 100
                                ? `${labor?.aboutMe?.description?.slice(0, 100)}...`
                                : labor?.aboutMe?.description}
                            </p>
                        <p className="text-sm text-gray-400">
                          {labor?.totalJobs} jobs completed
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate("/laborListing")}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    View All Available Labors
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CancellationModal;
