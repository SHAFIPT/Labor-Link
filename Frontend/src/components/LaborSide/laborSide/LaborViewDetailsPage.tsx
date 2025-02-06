import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, DollarSign, User, FileText, AlertCircle, ArrowLeft, IndianRupee } from 'lucide-react';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { RootState } from '../../../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import CancelBooking from './CancelBooking';
import { toast } from 'react-toastify';
import { setBookingDetails } from '../../../redux/slice/bookingSlice';
import { fetchBookings } from '../../../services/LaborServices';
import ResheduleModal from '../../UserSide/ResheduleModal';
import RescheduleRequestModal from './resheduleRequstModal';
import '../../Auth/LoadingBody.css'
import { setLoading } from '../../../redux/slice/laborSlice';
import AdditionalCharge from './AdditionalCharge';

const LaborViewDetailsPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  console.log("This is BBBBBBBBBBBBBB",booking)
  const bookingdetislss = useSelector((state: RootState) => state.booking.bookingDetails);

  const [cancelBooking, setCancelBooking] = useState(false)
  const loading = useSelector((state: RootState) => state.user.loading);
  const [resheduleModal, setResheduleModalOpen] = useState(null)
  const [resheduleModals, setResheduleModal] = useState(null);
  const [additionalCharge, setAdditionalCharge] = useState(null);
  const { Userlatitude, Userlongitude } = booking.addressDetails
  const { coordinates: laborCoordinates } = booking.laborId.location;
  const theme = useSelector((state: RootState) => state.theme.mode);
  
  // console.log("TTTTTTTTT",Userlatitude)
  console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrr", bookingdetislss)
  
  const bookingDetails = Array.isArray(bookingdetislss) 
  ? bookingdetislss.find(b => b.bookingId === booking?.bookingId)
  : booking;
  
  console.log("ppppppppppppppppppp", bookingDetails)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {
    bookingId,
    cancellation,
    createdAt,
    laborId,
    paymentStatus,
    quote,
    status,
    updatedAt,
    userId,
    additionalChargeRequest,
    addressDetails
  } = booking;

console.log("BBBEEEEESSSSSSSSSSSSSSSSSSSSSSSSS",bookingId)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

   const coordinates = useMemo(() => ({
    user: {
      latitude: Userlatitude,
      longitude: Userlongitude
    },
    labor: {
      latitude: laborCoordinates[1], // Assuming latitude is stored at index 1
      longitude: laborCoordinates[0] // Assuming longitude is stored at index 0
    }
  }), [Userlatitude, Userlongitude, laborCoordinates]);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiYXJycnUiLCJhIjoiY202bmtpMDZ0MDdyMzJpcGQ1Y3Q3d3JveCJ9.KjVmyabdUcsKhNFsWLe9-Q";

    if (!mapContainerRef.current) return;

    // Initialize map with control options
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordinates.user.longitude, coordinates.user.latitude],
      zoom: 8,
      attributionControl: false,  // Disable default attribution control
      logoPosition: 'bottom-right'
    });

    // Add minimal attribution in a less prominent position
    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: null
      }),
      'bottom-right'
    );

    mapRef.current = map;

    // Rest of your existing map code...
    map.on('load', () => {
      getRoute();

      const userPopup = new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h3>Customer Location</h3>');

      new mapboxgl.Marker({
        color: '#EF4444'
      })
        .setLngLat([coordinates.user.longitude, coordinates.user.latitude])
        .setPopup(userPopup)
        .addTo(map);

      const laborPopup = new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h3>Labor Location</h3>');

      new mapboxgl.Marker({
        color: '#22C55E'
      })
        .setLngLat([coordinates.labor.longitude, coordinates.labor.latitude])
        .setPopup(laborPopup)
        .addTo(map);

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    });

    async function getRoute() {
      try {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.labor.longitude},${coordinates.labor.latitude};${coordinates.user.longitude},${coordinates.user.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
          { method: 'GET' }
        );
        const json = await query.json();
        
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };
        
        if (map.getSource('route')) {
          (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
        }

        const bounds = new mapboxgl.LngLatBounds();
        route.forEach(point => {
          bounds.extend(point as [number, number]);
        });
        
        map.fitBounds(bounds, {
          padding: 50
        });
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }

    return () => map.remove();
  }, [coordinates]);

   const fetchBookingData = async () => {
    if (!bookingId) return;
    
    dispatch(setLoading(true));
    try {
      const response = await fetchBookings(bookingId);
      if (response.status === 200) {
        
        dispatch(setBookingDetails(response.data.bookings));
      } else {
        toast.error('Error fetching booking details');
      }
    } catch (error) {
      toast.error('Failed to fetch booking details');
      console.error('Fetch error:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBookingData();
  }, [bookingId, dispatch]);

  
  const isRescheduleReset = (reschedule) => {
    return reschedule.isReschedule === true &&
      !reschedule.newTime &&
      !reschedule.newDate &&
      !reschedule.reasonForReschedule &&
      !reschedule.requestSentBy &&
      !reschedule.rejectedBy &&
      !reschedule.rejectionNewDate &&
      !reschedule.rejectionNewTime &&
      !reschedule.rejectionReason;
  };

  // Helper function to check if reschedule is rejected with new details
  const hasRejectionDetails = (reschedule) => {
  const hasRejection = 
    reschedule.rejectedBy === "user" &&
    reschedule.rejectionNewDate &&
    reschedule.rejectionNewTime &&
    reschedule.rejectionReason;

  const hasRequest = 
    reschedule.requestSentBy === "user" &&
    reschedule.newDate &&
    reschedule.newTime &&
    reschedule.reasonForReschedule;

  return hasRejection || hasRequest;
};

  return (
    <>
      {loading && <div className="loader"></div>}
      {resheduleModal && (
        <ResheduleModal
          onClose={() => setResheduleModalOpen(false)}
          bookingId={resheduleModal}
        />
      )}
      <RescheduleRequestModal
        isOpen={resheduleModals !== null}
        onClose={() => setResheduleModal(null)}
        bookingDetails={resheduleModals ? [resheduleModals] : []}
      />
      {additionalCharge && (
        <AdditionalCharge
          onClose={() => setAdditionalCharge(null)}
          bookingId={additionalCharge}
          booking={booking}
        />
      )}
      {theme === "light" ? (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-blue-600 px-6 py-4">
                <div className="flex items-center mb-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-white hover:text-blue-100 transition-colors mr-4"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h1 className="text-2xl font-bold text-white">
                    Booking Details
                  </h1>
                </div>
                <p className="text-blue-100">ID: {bookingId}</p>
              </div>

              {/* Status Banner */}
              <div
                className={`px-6 py-2 ${
                  status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : status === "canceled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                <p className="text-sm font-medium">
                  Status: {status.toUpperCase()}
                </p>
              </div>

              {/* Main Content */}
              <div className="p-6 space-y-6">
                {/* Quote Details */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Quote Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Arrival Time</p>
                        <p className="font-medium">
                          {formatDate(quote.arrivalTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Estimated Cost</p>
                        <p className="font-medium">${quote.estimatedCost}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-1">{quote.description}</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Customer Information
                  </h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={userId.ProfilePic}
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {userId.firstName} {userId.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Customer ID: {userId._id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Payment Information
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">
                      Payment Status: {paymentStatus.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Additional Charge: ₹{additionalChargeRequest.amount}
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {additionalChargeRequest.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Map Section - Updated positioning */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Route to Customer
                  </h2>
                  <div className="relative">
                    <div
                      ref={mapContainerRef}
                      className="h-96 w-full rounded-lg shadow-md overflow-hidden"
                      style={{ position: "relative", zIndex: 1 }}
                    />
                    <div className="mt-4 flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Labor Location</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Customer Location</span>
                      </div>
                    </div>
                  </div>
                </div>

                {cancelBooking && (
                  <CancelBooking
                    onClose={() => setCancelBooking(false)}
                    bookingId={booking.bookingId}
                  />
                )}

                {booking.status === "canceled" ? (
                  <div className="bg-red-600 text-white text-center p-4 rounded-lg">
                    <p className="font-bold text-lg">Booking Cancelled</p>
                  </div>
                ) : (
                  // Action Buttons
                  <div className="flex flex-col gap-4">
                    {/* Top Row Buttons (Responsive) */}
                     <div className="flex flex-wrap gap-4 justify-center md:justify-between">
                      <button
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full md:w-auto"
                        onClick={() => setCancelBooking(true)}
                      >
                        Cancel Booking
                      </button>
                        <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors w-full md:w-auto"
                        onClick={() => setAdditionalCharge(bookingId)}
                        >
                        Request Additional Charge
                      </button>

                      {/* Case 1: Rejection with details */}
                      {hasRejectionDetails(bookingDetails.reschedule) && (
                        <div className="flex flex-col items-center w-full space-y-2">
                          <button className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 transition-colors w-full md:w-auto"
                            onClick={() => setResheduleModal(bookingDetails)}
                          >
                            {bookingDetails.reschedule.rejectedBy === "user"  ? "View Rejection" : "View Request"}
                          </button>
                          {(() => {
                            if (bookingDetails.reschedule.rejectedBy === "user") {
                              return (
                                <p className="text-red-500 text-sm">
                                  Your reschedule request was rejected by{" "}
                                  {bookingDetails.userId.firstName}{" "}
                                  {bookingDetails.userId.lastName}
                                </p>
                              );
                            } else if (bookingDetails.reschedule.requestSentBy === "user") {
                              return (
                                <p className="text-yellow-500 text-sm">
                                  User sent a new reschedule request
                                </p>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}

                      {/* Case 2: Pending user request */}
                      {((bookingDetails.reschedule.requestSentBy === "labor" &&
                        bookingDetails.reschedule.acceptedBy === null &&
                        bookingDetails.reschedule.rejectedBy === null) ||
                        (bookingDetails.reschedule.requestSentBy === "labor" &&
                          bookingDetails.reschedule.rejectedBy === "labor")) && (
                        <div className="w-full text-center">
                          <p className="text-yellow-500 text-sm">
                            {bookingDetails.reschedule.rejectedBy === "labor"
                              ? "Your reschedule rejection request is pending. Please wait for user approval."
                              : "Your reschedule request is pending. Please wait for user approval."}
                          </p>
                        </div>
                      )}

                      {/* Case 3: Reset state */}
                      {isRescheduleReset(bookingDetails.reschedule) && (
                       
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
                      onClick={() =>
                            setResheduleModalOpen(bookingDetails.bookingId)
                          }
                          >
                        Reschedule
                      </button>
                      )}

                    </div>

                    {/* Bottom Centered Button */}
                    <div className="flex justify-center">
                      <button className="px-6 py-2 bg-green-600 lg:ml-10 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto">
                        Work Completed
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 text-sm text-gray-500">
                <p>Created: {formatDate(createdAt)}</p>
                <p>Last Updated: {formatDate(updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-700 shadow-lg rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-600 px-6 py-4">
                <div className="flex items-center mb-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-white hover:text-blue-100 transition-colors mr-4"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h1 className="text-2xl font-bold text-white">
                    Booking Details
                  </h1>
                </div>
                <p className="text-blue-100">ID: {bookingId}</p>
              </div>

              {/* Status Banner */}
              <div
                className={`px-6 py-2 ${
                  status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : status === "canceled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                <p className="text-sm font-medium">
                  Status: {status.toUpperCase()}
                </p>
              </div>

              {/* Main Content */}
              <div className="p-6 space-y-6">
                {/* Quote Details */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Quote Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Arrival Time</p>
                        <p className="font-medium">
                          {formatDate(quote.arrivalTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Estimated Cost</p>
                        <p className="font-bold">₹{quote.estimatedCost}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-1">{quote.description}</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Customer Information
                  </h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={userId.ProfilePic}
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {userId.firstName} {userId.lastName}
                      </p>
                      <p className="text-sm text-gray-200">
                        Phone no: {addressDetails?.phone}
                      </p>
                      <p className="text-sm text-gray-200">
                        Place : {addressDetails?.place}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Payment Information
                  </h2>
                  <div className="bg-gray-500 rounded-lg p-4">
                    <p className="font-medium">
                      Payment Status: {paymentStatus.toUpperCase()}
                    </p>
                    <p className="text-sm  mt-2">
                      Additional Charge: ₹{additionalChargeRequest.amount}
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {additionalChargeRequest.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Map Section - Updated positioning */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Route to Customer
                  </h2>
                  <div className="relative">
                    <div
                      ref={mapContainerRef}
                      className="h-96 w-full rounded-lg shadow-md overflow-hidden"
                      style={{ position: "relative", zIndex: 1 }}
                    />
                    <div className="mt-4 flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Labor Location</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Customer Location</span>
                      </div>
                    </div>
                  </div>
                </div>

                {cancelBooking && (
                  <CancelBooking
                    onClose={() => setCancelBooking(false)}
                    bookingId={booking.bookingId}
                  />
                )}
                {booking.status === "canceled" ? (
                  <div className="bg-red-600 text-white text-center p-4 rounded-lg">
                    <p className="font-bold text-lg">Booking Cancelled</p>
                  </div>
                ) : (
                  // Action Buttons
                  <div className="flex flex-col gap-4">
  {/* Top Row Buttons (Responsive) */}
  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
    {/* Cancel Booking Button */}
    <div className="w-full md:w-auto">
      <button
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full"
        onClick={() => setCancelBooking(true)}
      >
        Cancel Booking
      </button>
    </div>

    {/* Additional Charge Section */}
    <div className="w-full md:w-auto flex flex-col items-center md:items-start">
      {bookingDetails?.additionalChargeRequest?.status === "pending" && 
      bookingDetails?.additionalChargeRequest?.amount > 0 && 
      !bookingDetails?.additionalChargeRequest?.reason ? (
        <div className="text-center md:text-left w-full">
          <p className='text-yellow-500 text-sm'>
            <strong>Note:</strong> Your request has been sent to {bookingDetails?.userId?.firstName} and additional charges will only apply if they accept it. 
            The original estimated cost will remain unchanged until then.
          </p>
        </div>
      ) : (
        <button
          className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors w-full"
          onClick={() => setAdditionalCharge(bookingDetails.bookingId)}
        >
          Request Additional Charge
        </button>
      )}
    </div>

    {/* Reschedule and Rejection Section */}
    <div className="w-full md:w-auto flex flex-col items-center">
      {hasRejectionDetails(bookingDetails.reschedule) && (
        <div className="flex flex-col items-center w-full space-y-2">
          <button 
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 transition-colors w-full"
            onClick={() => setResheduleModal(bookingDetails)}
          >
            {bookingDetails.reschedule.rejectedBy === "user" ? "View Rejection" : "View Request"}
          </button>
          {(() => {
            if (bookingDetails.reschedule.rejectedBy === "user") {
              return (
                <p className="text-red-500 text-sm text-center">
                  Your reschedule request was rejected by{" "}
                  {bookingDetails.userId.firstName}{" "}
                  {bookingDetails.userId.lastName}
                </p>
              );
            } else if (bookingDetails.reschedule.requestSentBy === "user") {
              return (
                <p className="text-yellow-500 text-sm text-center">
                  User sent a new reschedule request
                </p>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Pending Reschedule Request */}
      {((bookingDetails.reschedule.requestSentBy === "labor" &&
        bookingDetails.reschedule.acceptedBy === null &&
        bookingDetails.reschedule.rejectedBy === null) ||
        (bookingDetails.reschedule.requestSentBy === "labor" &&
          bookingDetails.reschedule.rejectedBy === "labor")) && (
        <div className="w-full text-center">
          <p className="text-yellow-500 text-sm">
            {bookingDetails.reschedule.rejectedBy === "labor"
              ? "Your reschedule rejection request is pending. Please wait for user approval."
              : "Your reschedule request is pending. Please wait for user approval."}
          </p>
        </div>
      )}

      {/* Reschedule Button */}
      {isRescheduleReset(bookingDetails.reschedule) && (
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
          onClick={() => setResheduleModalOpen(bookingDetails.bookingId)}
        >
          Reschedule
        </button>
      )}
    </div>
  </div>

  {/* Bottom Centered Button */}
  <div className="flex justify-center">
    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto">
      Work Completed
    </button>
  </div>
</div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-500 px-6 py-4 text-sm ">
                <p>Created: {formatDate(createdAt)}</p>
                <p>Last Updated: {formatDate(updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LaborViewDetailsPage;